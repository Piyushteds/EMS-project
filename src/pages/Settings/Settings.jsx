import { Bell, LockKeyhole, Palette, UserRound, ShieldCheck, Save } from "lucide-react";
import PageHeader from "../../components/molecules/PageHeader/PageHeader";
import Button from "../../components/atoms/Button/Button";
import Avatar from "../../components/atoms/Avatar/Avatar";
import { authService } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import "./Settings.css";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const user = authService.getUser();
  return <>
    <PageHeader title="Settings" description="Manage your personal workspace preferences and session security." action={<Button variant="secondary" onClick={() => window.location.reload()}><Save size={16} /> Refresh Profile</Button>} />
    <div className="settings-layout">
      <aside className="settings-nav"><button className="active"><UserRound size={17} /> Profile</button><button><Bell size={17} /> Notifications</button><button><ShieldCheck size={17} /> Security</button><button><Palette size={17} /> Appearance</button></aside>
      <div className="settings-content">
        <section className="settings-section"><div><h3>Profile Information</h3><p>Account details returned by your EMS authentication API.</p></div><div className="profile-settings"><Avatar name={user?.fullName || "User"} size="lg" /><div><strong>{user?.fullName || "Signed-in user"}</strong><small>{user?.role || "Employee"}</small></div></div><div className="settings-fields"><label>Full name<input value={user?.fullName || ""} readOnly /></label><label>Email address<input value={user?.email || ""} readOnly /></label><label>Role<input value={user?.role || ""} readOnly /></label><label>User ID<input value={user?.userId ?? ""} readOnly /></label></div></section>
        <section className="settings-section"><div><h3>Appearance</h3><p>Choose the display mode for this browser.</p></div><div className="setting-toggle"><div><strong>Dark mode</strong><small>Use the dark interface across the workspace.</small></div><button onClick={toggleTheme} className={theme === "dark" ? "on" : ""} aria-label="Toggle dark mode"><i /></button></div></section>
        <section className="settings-section"><div><h3>Security</h3><p>Session authentication is handled by the ASP.NET Core API.</p></div><div className="security-box"><LockKeyhole /><div><strong>JWT Authentication</strong><p>Your token is attached to protected API requests and expires according to the backend response.</p></div><span>Active</span></div></section>
      </div>
    </div>
  </>;
}
