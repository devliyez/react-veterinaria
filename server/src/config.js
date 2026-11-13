import "dotenv/config";

const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name} (revisa tu .env)`);
  return v;
};

const jwtSecret = required("JWT_SECRET");
if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET debe tener al menos 32 caracteres");
}

export const config = {
  port: Number(process.env.PORT ?? 5000),
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  maxSimultaneas: Number(process.env.MAX_SIMULTANEAS ?? 1),
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: required("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "veterinaria",
  },
};
