import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { pool } from "../db.js";
import { config } from "../config.js";
import { HttpError } from "../errors.js";
import { loginSchema, parse } from "../validation.js";

const router = Router();

// Hash ficticio para que el tiempo de respuesta sea parecido exista o no el email
const DUMMY_HASH = bcrypt.hashSync("no-existe", 10);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});

router.post("/login", limiter, async (req, res) => {
  const { email, password } = parse(loginSchema, req.body);

  const [rows] = await pool.query(
    "SELECT id, email, contraseña FROM usuarios WHERE email = ?",
    [email]
  );
  const user = rows[0];
  const ok = await bcrypt.compare(password, user?.contraseña ?? DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, "Credenciales incorrectas.");

  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  res.json({ email: user.email, token });
});

export default router;
