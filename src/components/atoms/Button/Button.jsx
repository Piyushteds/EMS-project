import "./Button.css";
export default function Button({ children, variant = "primary", type = "button", className = "", ...props }) {
  return <button type={type} className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}
