import { ESTADO_UI } from "../../constants/estados";

export default function EstadoBadge({ estado }) {
  const ui = ESTADO_UI[estado] ?? { label: estado, className: "bg-secondary" };
  return <span className={`badge ${ui.className}`}>{ui.label}</span>;
}
