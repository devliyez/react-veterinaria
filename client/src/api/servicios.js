import { request } from "./client";

export const getServicios = () => request("/servicios");

export const crearServicio = (data) =>
  request("/servicios", { method: "POST", body: data });

export const actualizarServicio = (id, data) =>
  request(`/servicios/${id}`, { method: "PUT", body: data });

export const eliminarServicio = (id) =>
  request(`/servicios/${id}`, { method: "DELETE" });
