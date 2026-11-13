import { z } from "zod";
import { HttpError } from "./errors.js";

const texto = (max) => z.string().trim().min(1, "Requerido").max(max);

export const reservaSchema = z.object({
  servicio: texto(100), 
  mascota: texto(100),
  cliente: texto(100),
  email: z.string().trim().email("Email inválido").max(150),
  telefono: z.string().trim().regex(/^9\d{8}$/, "El telefono debe tener 9 dígitos"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (AAAA-MM-DD)"),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Hora inválida (HH:MM)"),
  estado: z.enum(["pendiente", "confirmado", "cancelado"]).optional(),
});

export const estadoSchema = z.object({
  estado: z.enum(["pendiente", "confirmado", "cancelado"]),
});

export const servicioSchema = z.object({
  nombre: texto(100),
  precio: z.coerce.number().min(0).max(99999999),
  duracion: z.coerce.number().int().min(1).max(1440),
  descripcion: z.string().trim().max(2000).optional().default(""),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

//Valida y devuelve los datos, o lanza HttpError 400 
export function parse(schema, data) {
  const r = schema.safeParse(data);
  if (!r.success) {
    const issue = r.error.issues[0];
    const campo = issue.path.join(".");
    throw new HttpError(400, campo ? `${campo}: ${issue.message}` : issue.message);
  }
  return r.data;
}
