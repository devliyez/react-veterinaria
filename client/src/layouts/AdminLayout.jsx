import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import logo from "../assets/vet_logo.webp";

const linkClass = ({ isActive }) =>
  `nav-link text-white rounded ${isActive ? "bg-primary" : ""}`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <aside className="sidebar bg-dark text-white p-3 d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-4">
          <img src={logo} alt="" height="36" />
          <span className="h5 mb-0">Veterinaria</span>
        </div>

        <nav className="nav flex-column gap-1">
          <NavLink to="/reservas" className={linkClass}>Reservas</NavLink>
          <NavLink to="/servicios" className={linkClass}>Servicios</NavLink>
        </nav>

        <div className="mt-auto pt-4 small">
          <div className="text-white-50 text-truncate mb-2">{user?.email}</div>
          <button className="btn btn-outline-danger btn-sm w-100" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
