# Veterinaria · Panel de administración

SPA de React (Vite) solo para el personal que gestiona reservas y servicios.

## Ejecutar

```bash
npm install

npm run dev
```


## Estructura

```
src/
├── app/router.jsx          rutas
├── api/                    TODO el acceso a la API (client, reservas, servicios, auth)
├── features/
│   ├── auth/               AuthContext, ProtectedRoute, LoginPage
│   ├── reservas/           página, tabla, modal, hook useReservas
│   └── servicios/          página, formulario, tabla, hook useServicios
├── layouts/AdminLayout.jsx 
├── components/             Modal, ConfirmDialog, Loading, ErrorAlert
└── constants/estados.js    pendiente | confirmado | cancelado
```
