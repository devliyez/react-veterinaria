import { Router } from "express";
import { pool } from "../db.js";
import { config } from "../config.js";
import { HttpError } from "../errors.js";
import { reservaSchema, estadoSchema, parse } from "../validation.js";

const router = Router();


const SELECT = `
  SELECT r.id, r.servicio_id AS servicioId, s.nombre AS servicio,
         r.cliente, r.mascota, r.email, r.telefono,
         DATE_FORMAT(r.fecha_hora, '%Y-%m-%d') AS fecha,
         DATE_FORMAT(r.fecha_hora, '%H:%i')    AS hora,
         r.estado
  FROM reservas r
  JOIN servicios s ON s.id = r.servicio_id`;

async function obtener(id) {
  const [rows] = await pool.query(`${SELECT} WHERE r.id = ?`, [id]);
  if (!rows[0]) throw new HttpError(404, "Reserva no encontrada");
  return rows[0];
}

async function resolverServicio(nombre) {
  const [rows] = await pool.query(
    "SELECT id, duracion_min FROM servicios WHERE nombre = ?",
    [nombre]
  );
  if (!rows[0]) throw new HttpError(400, `servicio: "${nombre}" no existe`);
  return rows[0];
}

const aFechaHora = (fecha, hora) => `${fecha} ${hora.length === 5 ? `${hora}:00` : hora}`;

// Verificar reservas activas en un mismo horario
async function verificarDisponibilidad(fechaHora, duracionMin, excluirId = 0) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS n
       FROM reservas r
       JOIN servicios s ON s.id = r.servicio_id
      WHERE r.estado <> 'cancelado'
        AND r.id <> ?
        AND r.fecha_hora < DATE_ADD(?, INTERVAL ? MINUTE)
        AND DATE_ADD(r.fecha_hora, INTERVAL s.duracion_min MINUTE) > ?`,
    [excluirId, fechaHora, duracionMin, fechaHora]
  );
  if (rows[0].n >= config.maxSimultaneas) {
    throw new HttpError(409, "Ese horario ya está ocupado para el servicio elegido.");
  }
}

router.get("/", async (_req, res) => {
  const [rows] = await pool.query(`${SELECT} ORDER BY r.fecha_hora`);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const d = parse(reservaSchema, req.body);
  const servicio = await resolverServicio(d.servicio);
  const fechaHora = aFechaHora(d.fecha, d.hora);
  const estado = d.estado ?? "pendiente";

  if (estado !== "cancelado") await verificarDisponibilidad(fechaHora, servicio.duracion_min);

  const [r] = await pool.query(
    `INSERT INTO reservas (servicio_id, cliente, mascota, email, telefono, fecha_hora, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [servicio.id, d.cliente, d.mascota, d.email, d.telefono, fechaHora, estado]
  );
  res.status(201).json(await obtener(r.insertId));
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await obtener(id);
  const d = parse(reservaSchema, req.body);
  const servicio = await resolverServicio(d.servicio);
  const fechaHora = aFechaHora(d.fecha, d.hora);
  const estado = d.estado ?? "pendiente";

  if (estado !== "cancelado") await verificarDisponibilidad(fechaHora, servicio.duracion_min, id);

  await pool.query(
    `UPDATE reservas
        SET servicio_id = ?, cliente = ?, mascota = ?, email = ?, telefono = ?,
            fecha_hora = ?, estado = ?
      WHERE id = ?`,
    [servicio.id, d.cliente, d.mascota, d.email, d.telefono, fechaHora, estado, id]
  );
  res.json(await obtener(id));
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const actual = await obtener(id);
  const { estado } = parse(estadoSchema, req.body);

  // Reactivar una reserva cancelada vuelve a requerir disponibilidad
  if (actual.estado === "cancelado" && estado !== "cancelado") {
    const [[s]] = await pool.query("SELECT duracion_min FROM servicios WHERE id = ?", [actual.servicioId]);
    await verificarDisponibilidad(aFechaHora(actual.fecha, actual.hora), s.duracion_min, id);
  }

  await pool.query("UPDATE reservas SET estado = ? WHERE id = ?", [estado, id]);
  res.json(await obtener(id));
});

export default router;
