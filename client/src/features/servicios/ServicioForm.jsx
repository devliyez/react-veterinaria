import { useState } from "react";

const VACIO = { nombre: "", precio: "", duracion: "", descripcion: "" };

/** Montar con key={servicio?.id ?? "nuevo"} para reiniciar al cambiar de modo. */
export default function ServicioForm({ servicio, onSubmit, onCancel }) {
  const editando = !!servicio;
  const [form, setForm] = useState(
    servicio
      ? {
          nombre: servicio.nombre,
          precio: servicio.precio,
          duracion: servicio.duracion,
          descripcion: servicio.descripcion ?? "",
        }
      : VACIO
  );
  const [guardando, setGuardando] = useState(false);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onSubmit({
        ...form,
        nombre: form.nombre.trim(),
        precio: Number(form.precio),
        duracion: Number(form.duracion),
      });
      if (!editando) setForm(VACIO);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body shadow-sm mb-4">
      <h2 className="h6 mb-3">{editando ? "✏️ Editar servicio" : "➕ Nuevo servicio"}</h2>
      <div className="row g-2">
        <div className="col-md-3">
          <input className="form-control" placeholder="Nombre" value={form.nombre} onChange={set("nombre")} required />
        </div>
        <div className="col-md-2">
          <input type="number" min="0" step="0.01" className="form-control" placeholder="Precio (S/)" value={form.precio} onChange={set("precio")} required />
        </div>
        <div className="col-md-2">
          <input type="number" min="1" step="1" className="form-control" placeholder="Duración (min)" value={form.duracion} onChange={set("duracion")} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Descripción" value={form.descripcion} onChange={set("descripcion")} />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button className="btn btn-primary flex-grow-1" disabled={guardando}>
            {editando ? "Actualizar" : "Agregar"}
          </button>
          {editando && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>✕</button>
          )}
        </div>
      </div>
    </form>
  );
}
