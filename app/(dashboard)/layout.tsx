import type { Metadata } from "next";

import Sidebar from "@/components/shared/sidebar/Sidebar";
import "@/style/globals.css";

export const metadata: Metadata = {
  title: "Learning page",
  description: "learning is the key success",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex ">
      {/* sidebar div  */}

      <div
        className="fixed hidden md:flex inset-0 w-72 h-full  border-r p-4 bg-white z-[50]
      "
      >
        <Sidebar />
      </div>

      {/* Pages div  */}
      <div className=" md:ml-72 w-full  h-full mt-20">{children}</div>
    </div>
  );
}
