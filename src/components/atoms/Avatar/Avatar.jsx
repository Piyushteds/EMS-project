import "./Avatar.css";
import { initials } from "../../../utils/format"; export default function Avatar({ name, size="md" }) { return <div className={`avatar avatar-${size}`}>{initials(name)}</div>; }