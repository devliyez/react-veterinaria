import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { HttpError } from "../errors.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) throw new HttpError(401, "No autenticado");

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    throw new HttpError(401, "Sesión inválida o expirada");
  }
}
