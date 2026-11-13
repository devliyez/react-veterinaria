import { useState } from "react";
import Modal from "../../components/Modal";
import ErrorAlert from "../../components/ErrorAlert";
import { ESTADOS, ESTADO_UI } from "../../constants/estados";

const VACIA = {
  servicio: "",
  mascota: "",
  cliente: "",
  email: "",
  telefono: "",
  fecha: "",
  hora: "",
  estado: ESTADOS.PENDIENTE,
};

/**
 * reserva = null  -> crear
 * reserva = {...} -> editar
 * El padre debe montarlo solo cuando se abre (así el estado inicial es correcto).
 */
export default function ReservaFormModal({ reserva, servicios, onSubmit, onClose }) {
  const editando = !!reserva;
  const [form, setForm] = useState(reserva ? { ...VACIA, ...reserva } : VACIA);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  };

  const nombres = servicios.map((s) => s.nombre);
  if (form.servicio && !nombres.includes(form.servicio)) nombres.push(form.servicio);

  return (
    <Modal title={editando ? "Editar reserva" : "Nueva reserva"} onClose={onClose}>
      <form onSubmit={handleSubmit} id="reserva-form">
        <ErrorAlert mensaje={error} />

        <label className="form-label">Servicio</label>
        <select className="form-select mb-2" value={form.servicio} onChange={set("servicio")} required>
          <option value="">-- Selecciona un servicio --</option>
          {nombres.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <label className="form-label">Mascota</label>
            <input className="form-control" value={form.mascota} onChange={set("mascota")} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cliente</label>
            <input className="form-control" value={form.cliente} onChange={set("cliente")} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={set("email")} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Teléfono</label>
            <input type="tel" className="form-control" value={form.telefono} onChange={set("telefono")} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha</label>
            <input type="date" className="form-control" value={form.fecha} onChange={set("fecha")} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Hora</label>
            <input type="time" className="form-control" value={form.hora} onChange={set("hora")} required />
          </div>
        </div>

        {editando && (
          <>
            <label className="form-label">Estado</label>
            <select className="form-select" value={form.estado} onChange={set("estado")}>
              {Object.entries(ESTADO_UI).map(([valor, ui]) => (
                <option key={valor} value={valor}>{ui.label}</option>
              ))}
            </select>
          </>
        )}
      </form>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        <button type="submit" form="reserva-form" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </Modal>
  );
}
