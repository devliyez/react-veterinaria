# Veterinaria · Sistema de reservas (panel de administración)

```
veterinaria/
├── client/   React + Vite (panel del administrador)
└── server/   API Node + Express + MySQL (JWT)
```

## 1. Base de datos y API (`server/`)

Requisitos: Node 18+ y MySQL

```bash
npm install
npm run db:init          # crea la base 'veterinaria' y las tablas
npm run seed             # crea el usuario admin + 3 servicios de ejemplo
npm start                # API en http://localhost:5000
```

## 2. Panel (`client/`)

```bash
npm install
npm run dev              # http://localhost:5173
```

Inicia sesión con el `ADMIN_EMAIL` / `ADMIN_PASSWORD` que se encuentra en `server/.env`.

## Rutas de la API

| Método       | Ruta             | Descripción                           |
| ------------ | ---------------- | ------------------------------------- |
| POST         | `/auth/login`    | Devuelve `{ email, token }` (público) |
| GET / POST   | `/servicios`     | Listar / crear                        |
| PUT / DELETE | `/servicios/:id` | Editar / eliminar                     |
| GET / POST   | `/reservas`      | Listar / crear                        |
| PUT          | `/reservas/:id`  | Editar reserva completa               |
| PATCH        | `/reservas/:id`  | Cambiar solo el estado                |

Todas exigen el token, a excepcion del login.

## Reglas de negocio

- Una reserva ocupa desde su hora de inicio hasta inicio + duración del servicio.
- No se permiten reservas que generen un conflicto en el horario.
- Un servicio con reservas asociadas no se puede eliminar.
- Cambiar el password del admin: edita `ADMIN_PASSWORD` y vuelve a ejecutar `npm run seed`.
