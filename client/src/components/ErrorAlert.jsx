export default function ErrorAlert({ mensaje, onClose }) {
  if (!mensaje) return null;
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <span>{mensaje}</span>
      {onClose && (
        <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
      )}
    </div>
  );
}
