import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { pool } from "./db.js";
import { requireAuth } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import serviciosRoutes from "./routes/servicios.js";
import reservasRoutes from "./routes/reservas.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "100kb" }));

app.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/servicios", requireAuth, serviciosRoutes);
app.use("/reservas", requireAuth, reservasRoutes);

app.use((_req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// Manejador de errores central (Express 5 captura también los async)
app.use((err, _req, res, _next) => {
  if (err.status) return res.status(err.status).json({ error: err.message });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "JSON inválido" });
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const server = app.listen(config.port, () =>
  console.log(`API lista en http://localhost:${config.port}`)
);

const cerrar = () => server.close(() => pool.end().then(() => process.exit(0)));
process.on("SIGINT", cerrar);
process.on("SIGTERM", cerrar);
