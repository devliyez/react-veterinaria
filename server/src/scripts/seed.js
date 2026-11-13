// Crea/actualiza el usuario admin y agrega servicios de ejemplo si no hay ninguno
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { pool } from "../db.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const hash = await bcrypt.hash(password, 10);
await pool.query(
  `INSERT INTO usuarios (email, contraseña) VALUES (?, ?)
   ON DUPLICATE KEY UPDATE contraseña = VALUES(contraseña)`,
  [email, hash]
);
console.log(`✔Usuario admin: ${email}`);

const [[{ n }]] = await pool.query("SELECT COUNT(*) AS n FROM servicios");
if (n === 0) {
  await pool.query(
    "INSERT INTO servicios (nombre, precio, duracion_min, descripcion) VALUES ?",
    [[
      ["Consulta general", 60, 30, "Revisión completa de la mascota."],
      ["Baño y corte", 80, 60, "Baño, secado y corte de pelo."],
      ["Vacunación", 45, 20, "Aplicación de vacunas al día."],
    ]]
  );
  console.log("✔ Servicios de ejemplo creados");
}

console.log(`(BD: ${config.db.database})`);
await pool.end();
