import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import Topbar from "../../organisms/Topbar/Topbar";
import { useApp } from "../../../context/AppContext";
import Button from "../../atoms/Button/Button";
import "./AppShell.css";

export default function AppShell(){
  const [open,setOpen]=useState(false);
  const {error,refresh,loading}=useApp();
  return <div className="app-shell">
    <Sidebar open={open} onClose={()=>setOpen(false)}/>
    {open&&<button className="sidebar-scrim" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
    <div className="main-area">
      <Topbar onMenu={()=>setOpen(true)}/>
      <main className="content">
        {error&&<div className="api-alert"><span>{error}</span><Button variant="secondary" onClick={refresh} disabled={loading}>Retry</Button></div>}
        <Outlet/>
      </main>
    </div>
  </div>;
}
