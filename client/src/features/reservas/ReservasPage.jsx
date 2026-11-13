import { useMemo, useState } from "react";
import useReservas from "./useReservas";
import useServicios from "../servicios/useServicios";
import ReservasTable from "./ReservasTable";
import ReservaFormModal from "./ReservaFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loading from "../../components/Loading";
import ErrorAlert from "../../components/ErrorAlert";
import { ESTADOS, ESTADO_UI } from "../../constants/estados";

export default function ReservasPage() {
  const { reservas, loading, error, recargar, crear, editar, setEstado } = useReservas();
  const { servicios } = useServicios();

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null); // null | { reserva: obj | null }
  const [aCancelar, setACancelar] = useState(null);
  const [accionError, setAccionError] = useState("");

  const visibles = useMemo(() => { //Filtro y ordenamiento de reservas
    const q = busqueda.trim().toLowerCase();
    return reservas
      .filter((r) => filtroEstado === "todos" || r.estado === filtroEstado)
      .filter(
        (r) =>
          !q ||
          [r.cliente, r.mascota, r.email, r.servicio].some((v) => v?.toLowerCase().includes(q))
      )
      .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
  }, [reservas, filtroEstado, busqueda]);

  const ejecutar = async (fn) => {
    setAccionError("");
    try {
      await fn();
    } catch (e) {
      setAccionError(e.message);
    }
  };

  const guardar = async (form) => {
    if (modal.reserva) await editar(modal.reserva.id, form);
    else await crear(form);
    setModal(null);
  };

  const confirmarCancelacion = async () => {
    const r = aCancelar;
    setACancelar(null);
    await ejecutar(() => setEstado(r.id, ESTADOS.CANCELADO));
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Reservas</h1>
        <button className="btn btn-primary" onClick={() => setModal({ reserva: null })}>
          Nueva reserva
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Buscar por cliente, mascota, email o servicio"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {Object.entries(ESTADO_UI).map(([valor, ui]) => (
              <option key={valor} value={valor}>{ui.label}</option>
            ))}
          </select>
        </div>
      </div>

      <ErrorAlert mensaje={accionError} onClose={() => setAccionError("")} />

      {loading ? (
        <Loading texto="Cargando reservas..." />
      ) : error ? (
        <div className="alert alert-danger">
          {error}{" "}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={recargar}>Reintentar</button>
        </div>
      ) : (
        <ReservasTable
          reservas={visibles}
          onConfirmar={(r) => ejecutar(() => setEstado(r.id, ESTADOS.CONFIRMADO))}
          onCancelar={setACancelar}
          onEditar={(r) => setModal({ reserva: r })}
        />
      )}

      {modal && (
        <ReservaFormModal
          reserva={modal.reserva}
          servicios={servicios}
          onSubmit={guardar}
          onClose={() => setModal(null)}
        />
      )}

      {aCancelar && (
        <ConfirmDialog
          title="Cancelar reserva"
          message={`¿Cancelar la reserva de ${aCancelar.mascota} (${aCancelar.cliente}) del ${aCancelar.fecha} a las ${aCancelar.hora}?`}
          confirmText="Sí, cancelar"
          danger
          onConfirm={confirmarCancelacion}
          onCancel={() => setACancelar(null)}
        />
      )}
    </div>
  );
}
