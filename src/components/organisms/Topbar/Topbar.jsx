import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useApp } from "../../../context/AppContext";
import { authService } from "../../../services/authService";
import Avatar from "../../atoms/Avatar/Avatar";
import "./Topbar.css";
export default function Topbar({ onMenu }) { const navigate=useNavigate(); const {theme,toggleTheme}=useTheme(); const {notifications}=useApp(); const user=authService.getUser(); const unread=notifications.filter(n=>!n.read&&!n.isRead).length; return <header className="topbar"><button className="menu-btn" onClick={onMenu} aria-label="Open menu"><Menu/></button><div className="top-search"><Search size={17}/><input placeholder="Search employees..." onKeyDown={e=>{if(e.key==="Enter"&&e.currentTarget.value.trim())navigate(`/employees?search=${encodeURIComponent(e.currentTarget.value.trim())}`)}}/></div><div className="top-actions"><button onClick={toggleTheme} title="Toggle theme">{theme==="light"?<Moon size={18}/>:<Sun size={18}/>}</button><Link className="notification-btn" to="/notifications" title="Notifications"><Bell size={18}/>{unread>0&&<span>{unread}</span>}</Link><div className="top-user"><Avatar name={user?.fullName||"Administrator"}/><div><strong>{user?.fullName||"Administrator"}</strong><small>{user?.role||"Employee"}</small></div></div></div></header>; }
