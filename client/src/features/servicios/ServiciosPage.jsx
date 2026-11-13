import { useState } from "react";
import useServicios from "./useServicios";
import ServicioForm from "./ServicioForm";
import ServiciosTable from "./ServiciosTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loading from "../../components/Loading";
import ErrorAlert from "../../components/ErrorAlert";

export default function ServiciosPage() {
  const { servicios, loading, error, recargar, crear, editar, eliminar } = useServicios();
  const [editando, setEditando] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [accionError, setAccionError] = useState("");

  const guardar = async (data) => {
    setAccionError("");
    try {
      if (editando) {
        await editar(editando.id, data);
        setEditando(null);
      } else {
        await crear(data);
      }
    } catch (e) {
      setAccionError(e.message);
    }
  };

  const confirmarEliminar = async () => {
    const s = aEliminar;
    setAEliminar(null);
    setAccionError("");
    try {
      await eliminar(s.id);
      if (editando?.id === s.id) setEditando(null);
    } catch (e) {
      setAccionError(e.message);
    }
  };

  return (
    <div>
      <h1 className="h3 mb-3">Servicios</h1>

      <ServicioForm
        key={editando?.id ?? "nuevo"}
        servicio={editando}
        onSubmit={guardar}
        onCancel={() => setEditando(null)}
      />

      <ErrorAlert mensaje={accionError} onClose={() => setAccionError("")} />

      {loading ? (
        <Loading texto="Cargando servicios..." />
      ) : error ? (
        <div className="alert alert-danger">
          {error}{" "}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={recargar}>Reintentar</button>
        </div>
      ) : (
        <ServiciosTable servicios={servicios} onEditar={setEditando} onEliminar={setAEliminar} />
      )}

      {aEliminar && (
        <ConfirmDialog
          title="Eliminar servicio"
          message={`¿Eliminar el servicio "${aEliminar.nombre}"? Si tiene reservas asociadas, no podrá eliminarse.`}
          confirmText="Eliminar"
          danger
          onConfirm={confirmarEliminar}
          onCancel={() => setAEliminar(null)}
        />
      )}
    </div>
  );
}
