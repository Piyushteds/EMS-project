import "./Modal.css";
import { X } from "lucide-react";
export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <h2>{title}</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
