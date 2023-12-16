import type { Metadata } from "next";
import "@/style/globals.css";

export const metadata: Metadata = {
  title: "Authenticateion page",
  description: "learning is the key success",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      {children}
    </div>
  );
}
