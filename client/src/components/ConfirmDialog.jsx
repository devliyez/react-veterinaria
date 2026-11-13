import Modal from "./Modal";

export default function ConfirmDialog({
  title = "Confirmar",
  message,
  confirmText = "Aceptar",
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel}>Volver</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </>
      }
    >
      <p className="mb-0">{message}</p>
    </Modal>
  );
}
