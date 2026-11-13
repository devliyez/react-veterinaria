const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
export const SESSION_KEY = "vet_admin_session";

function leerToken() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))?.token ?? null;
  } catch {
    return null;
  }
}


export async function request(path, { method = "GET", body } = {}) {
  const token = leerToken();
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));

    if (res.status === 401 && token) {
      localStorage.removeItem(SESSION_KEY);
      window.location.assign("/login");
    }
    throw new Error(data.error ?? `Error del servidor (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json().catch(() => null);
}
