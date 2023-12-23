"use client";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { Menu } from "lucide-react";
import { FC } from "react";

interface MobileMenuProps {}

const MobileMenu: FC<MobileMenuProps> = ({}) => {
  const mobileNav = useMobileNavigation();
  return (
    <div
      className="w-fit px-4 py-2 h-fit hover:bg-slate-100 cursor-pointer transition-colors duration-300 rounded-md md:hidden inline-block"
      onClick={() => mobileNav.onOpen()}
    >
      <Menu className="w-6 h-6" />
    </div>
  );
};

export default MobileMenu;
