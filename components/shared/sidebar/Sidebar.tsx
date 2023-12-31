"use client";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  CircleDollarSign,
  Compass,
  Layout,
  LucideIcon,
  PlusCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface navigationInterface {
  Icon: LucideIcon;
  href: string;
  label: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const dashboardPanel: navigationInterface[] = [
    { label: "Dashboard", href: "/", Icon: Layout },
    { label: "Browse", href: "/browse", Icon: Compass },
  ];

  const teacherPanel: navigationInterface[] = [
    { label: "Analytics", href: "/teacher/analytics", Icon: BarChart2 },
    { label: "Sales", href: "/teacher/courses", Icon: CircleDollarSign },
    {
      label: "Create course",
      href: "/teacher/create",
      Icon: PlusCircle,
    },
  ];

  const handleClick = (href: string) => {
    router.push(href);
  };

  const checkRoute = (href: string) => {
    const isActive =
      pathname === href ? "text-black bg-slate-100" : "text-slate-500 ";
    return isActive;
  };

  const panelData = pathname.startsWith("/teacher")
    ? teacherPanel
    : dashboardPanel;

  return (
    <aside className="md:mt-20 flex flex-col space-y-3 w-full">
      <>
        {panelData?.map((navigation, index) => (
          <span
            key={index}
            onClick={() => handleClick(navigation?.href)}
            className={cn(
              "text-black text-sm font-medium antialiased  p-4 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors duration-300 w-full flex items-center ",
              checkRoute(navigation?.href)
            )}
          >
            <navigation.Icon className="w-5 h-5 mr-2 transition-all duration-300 animate_spin_once" />
            {navigation?.label}
          </span>
        ))}
      </>
    </aside>
  );
};

export default Sidebar;
