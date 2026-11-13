export const ESTADOS = {
  PENDIENTE: "pendiente",
  CONFIRMADO: "confirmado",
  CANCELADO: "cancelado",
};

export const ESTADO_UI = {
  pendiente: { label: "Pendiente", className: "bg-warning text-dark" },
  confirmado: { label: "Confirmado", className: "bg-success" },
  cancelado: { label: "Cancelado", className: "bg-danger" },
};

const LEGACY = {
  pending: ESTADOS.PENDIENTE,
  confirmed: ESTADOS.CONFIRMADO,
  cancelled: ESTADOS.CANCELADO,
  canceled: ESTADOS.CANCELADO,
};

export const normalizarEstado = (estado) => LEGACY[estado] ?? estado;
