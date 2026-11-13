import { request } from "./client";
import { normalizarEstado } from "../constants/estados";

// Punto único de adaptación entre el formato de la API y el de la app.
const desdeApi = (r) => ({ ...r, estado: normalizarEstado(r.estado) });

export const getReservas = async () =>
  (await request("/reservas")).map(desdeApi);

export const crearReserva = async (data) =>
  desdeApi(await request("/reservas", { method: "POST", body: data }));

export const actualizarReserva = async (id, data) =>
  desdeApi(await request(`/reservas/${id}`, { method: "PUT", body: data }));

export const cambiarEstado = async (id, estado) =>
  desdeApi(await request(`/reservas/${id}`, { method: "PATCH", body: { estado } }));
