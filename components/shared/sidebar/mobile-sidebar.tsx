"use client";
import { FC } from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";

interface MobileSidebarProps {}

const MobileSidebar: FC<MobileSidebarProps> = ({}) => {
  const mobileNav = useMobileNavigation();

  return (
    <Sheet open={mobileNav.isOpen} onOpenChange={mobileNav.onClose}>
      <SheetContent className="w-72">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
