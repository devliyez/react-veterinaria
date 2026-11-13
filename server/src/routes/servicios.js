import { Router } from "express";
import { pool } from "../db.js";
import { HttpError } from "../errors.js";
import { servicioSchema, parse } from "../validation.js";

const router = Router();

const SELECT = `SELECT id, nombre, precio, duracion_min AS duracion, descripcion FROM servicios`;

async function obtener(id) {
  const [rows] = await pool.query(`${SELECT} WHERE id = ?`, [id]);
  if (!rows[0]) throw new HttpError(404, "Servicio no encontrado");
  return rows[0];
}

// manejar duplicado de nombre de servicio
const manejarDuplicado = (e) => {
  if (e.code === "ER_DUP_ENTRY") throw new HttpError(409, "Ya existe un servicio con ese nombre");
  throw e;
};

router.get("/", async (_req, res) => {
  const [rows] = await pool.query(`${SELECT} ORDER BY nombre`);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const d = parse(servicioSchema, req.body);
  try {
    const [r] = await pool.query(
      "INSERT INTO servicios (nombre, precio, duracion_min, descripcion) VALUES (?, ?, ?, ?)",
      [d.nombre, d.precio, d.duracion, d.descripcion]
    );
    res.status(201).json(await obtener(r.insertId));
  } catch (e) {
    manejarDuplicado(e);
  }
});

router.put("/:id", async (req, res) => {
  const d = parse(servicioSchema, req.body);
  await obtener(req.params.id);
  try {
    await pool.query(
      "UPDATE servicios SET nombre = ?, precio = ?, duracion_min = ?, descripcion = ? WHERE id = ?",
      [d.nombre, d.precio, d.duracion, d.descripcion, req.params.id]
    );
  } catch (e) {
    manejarDuplicado(e);
  }
  res.json(await obtener(req.params.id));
});

router.delete("/:id", async (req, res) => {
  await obtener(req.params.id);
  try {
    await pool.query("DELETE FROM servicios WHERE id = ?", [req.params.id]);
  } catch (e) {
    if (e.code === "ER_ROW_IS_REFERENCED_2") {
      throw new HttpError(409, "No se puede eliminar: el servicio tiene reservas asociadas.");
    }
    throw e;
  }
  res.status(204).end();
});

export default router;
