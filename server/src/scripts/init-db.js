// Crea la base de datos y las tablas ejecutando sql/schema.sql
import "dotenv/config";
import fs from "node:fs";
import mysql from "mysql2/promise";

const sql = fs.readFileSync(new URL("../../sql/schema.sql", import.meta.url), "utf8");

const conn = await mysql.createConnection({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? "",
  multipleStatements: true,
});

await conn.query(sql);
await conn.end();
console.log("✔ Base de datos y tablas listas");
