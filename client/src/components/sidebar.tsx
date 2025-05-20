import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  BarChart2,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  closeMobile?: () => void;
}

export function Sidebar({ closeMobile }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path || (location === "/" && path === "/dashboard");
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-3" />,
    },
    {
      href: "/clients",
      label: "Clients",
      icon: <Users className="h-5 w-5 mr-3" />,
    },
    {
      href: "/projects",
      label: "Projects",
      icon: <Briefcase className="h-5 w-5 mr-3" />,
    },
    {
      href: "/payments",
      label: "Payments",
      icon: <CreditCard className="h-5 w-5 mr-3" />,
    },
    {
      href: "/reports",
      label: "Reports",
      icon: <BarChart2 className="h-5 w-5 mr-3" />,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5 mr-3" />,
    },
  ];

  return (
    <div className="bg-neutral-900 text-white w-64 flex-shrink-0 h-screen">
      <div className="p-4 flex items-center justify-between">
        <span className="text-xl font-bold text-accent">AgencyCRM</span>
        {closeMobile && (
          <button onClick={closeMobile} className="text-white md:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="h-[calc(100vh-4rem)] overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-4 py-3",
                    isActive(item.href)
                      ? "text-white bg-primary/20 border-l-4 border-primary"
                      : "text-white/70 hover:bg-white/10 hover:text-white transition duration-150"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
