import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";
import ReservasPage from "../features/reservas/ReservasPage";
import ServiciosPage from "../features/servicios/ServiciosPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/reservas" replace /> },
          { path: "reservas", element: <ReservasPage /> },
          { path: "servicios", element: <ServiciosPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
