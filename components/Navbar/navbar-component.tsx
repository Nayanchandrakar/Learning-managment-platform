import { FC } from "react";

import Logo from "@/components/Navbar/Logo";
import SearchBar from "@/components/Navbar/searchbar";
import Controls from "@/components/Navbar/control";
import MobileMenu from "./mobile-menu";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <header className="w-full h-20 border-b fixed inset-0 bg-white z-[60] flex items-center justify-between px-4 space-x-8">
      <MobileMenu />
      <Logo />
      <SearchBar />
      <Controls />
    </header>
  );
};

export default Navbar;
