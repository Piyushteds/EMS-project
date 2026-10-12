import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  ClipboardList,
  WalletCards,
  TrendingUp,
  FileText,
  Bell,
  Settings,
  CircleHelp
} from "lucide-react";

export const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", path: "/employees", icon: Users },
  { label: "Departments", path: "/departments", icon: Building2 },
  { label: "Attendance", path: "/attendance", icon: CalendarCheck },
  { label: "Leave", path: "/leave", icon: ClipboardList },
  { label: "Payroll", path: "/payroll", icon: WalletCards },
  { label: "Performance", path: "/performance", icon: TrendingUp },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Help", path: "/help", icon: CircleHelp }
];
