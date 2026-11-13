export default function ServiciosTable({ servicios, onEditar, onEliminar }) {
  if (servicios.length === 0) {
    return <p className="text-center text-muted py-4">Aún no hay servicios registrados.</p>;
  }

  return (
    <div className="table-responsive bg-white shadow-sm rounded">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Descripción</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((s) => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>S/ {Number(s.precio).toFixed(2)}</td>
              <td>{s.duracion} min</td>
              <td>{s.descripcion}</td>
              <td className="text-end text-nowrap">
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => onEditar(s)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(s)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
