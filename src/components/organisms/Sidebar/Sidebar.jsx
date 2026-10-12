import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { navigation } from "../../../constants/navigation";
import { authService } from "../../../services/authService";
import "./Sidebar.css";
export default function Sidebar({ open, onClose }) { const navigate=useNavigate(); const logout=()=>{authService.logout();navigate("/login",{replace:true});}; return <aside className={`sidebar ${open?"sidebar-open":""}`}><div className="brand"><div className="brand-mark">E</div><div><strong>EMS Pro</strong><small>Employee Suite</small></div><button className="mobile-close" onClick={onClose}><X/></button></div><nav>{navigation.map(({label,path,icon:Icon})=><NavLink key={path} to={path} onClick={onClose} className={({isActive})=>isActive?"active":""}><Icon size={18}/><span>{label}</span></NavLink>)}</nav><div className="sidebar-bottom"><button onClick={logout}><LogOut size={17}/> Logout</button></div></aside>; }
