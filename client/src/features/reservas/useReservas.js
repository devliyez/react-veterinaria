import { useCallback, useEffect, useState } from "react";
import {
  getReservas,
  crearReserva,
  actualizarReserva,
  cambiarEstado,
} from "../../api/reservas";
import { ESTADOS } from "../../constants/estados";

export default function useReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReservas(await getReservas());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { cargar(); }, []);

  // Las funciones de mutación lanzan el error para que la UI lo muestre
  const crear = async (data) => {
    const nueva = await crearReserva({ ...data, estado: ESTADOS.PENDIENTE });
    setReservas((prev) => [...prev, nueva]);
  };

  const editar = async (id, data) => {
    const actualizada = await actualizarReserva(id, { ...data, id });
    setReservas((prev) => prev.map((r) => (r.id === id ? actualizada : r)));
  };

  const setEstado = async (id, estado) => {
    const actualizada = await cambiarEstado(id, estado);
    setReservas((prev) => prev.map((r) => (r.id === id ? actualizada : r)));
  };

  return { reservas, loading, error, recargar: cargar, crear, editar, setEstado };
}
