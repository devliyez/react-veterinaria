import EstadoBadge from "./EstadoBadge";
import { ESTADOS } from "../../constants/estados";

export default function ReservasTable({ reservas, onConfirmar, onCancelar, onEditar }) {
  if (reservas.length === 0) {
    return <p className="text-center text-muted py-4">No hay reservas para mostrar.</p>;
  }

  return (
    <div className="table-responsive bg-white shadow-sm rounded">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Servicio</th>
            <th>Mascota</th>
            <th>Cliente</th>
            <th>Contacto</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td>{r.fecha}</td>
              <td>{r.hora}</td>
              <td>{r.servicio}</td>
              <td>{r.mascota}</td>
              <td>{r.cliente}</td>
              <td>
                <div>{r.email}</div>
                <small className="text-muted">{r.telefono}</small>
              </td>
              <td><EstadoBadge estado={r.estado} /></td>
              <td className="text-end text-nowrap">
                {r.estado === ESTADOS.PENDIENTE && (
                  <button className="btn btn-sm btn-success me-1" onClick={() => onConfirmar(r)}>
                    Confirmar
                  </button>
                )}
                {r.estado !== ESTADOS.CANCELADO && (
                  <button className="btn btn-sm btn-outline-danger me-1" onClick={() => onCancelar(r)}>
                    Cancelar
                  </button>
                )}
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onEditar(r)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
