import { useCallback, useEffect, useState } from "react";
import {
  getServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from "../../api/servicios";

export default function useServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  // Cargar servicios al llamar al componente
  
  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServicios(await getServicios());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => { cargar(); }, []);

  const crear = async (data) => {
    const nuevo = await crearServicio(data);
    setServicios((prev) => [...prev, nuevo]);
  };

  const editar = async (id, data) => {
    const actualizado = await actualizarServicio(id, { ...data, id });
    setServicios((prev) => prev.map((s) => (s.id === id ? actualizado : s)));
  };

  const eliminar = async (id) => {
    await eliminarServicio(id);
    setServicios((prev) => prev.filter((s) => s.id !== id));
  };

  return { servicios, loading, error, recargar: cargar, crear, editar, eliminar };
}
