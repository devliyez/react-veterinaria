import { request } from "./client";

/** Devuelve { email, token } si las credenciales son correctas. */
export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password } });
