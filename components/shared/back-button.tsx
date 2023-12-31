"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
}

const BackButton: FC<BackButtonProps> = ({ label }) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router?.back()}
      variant="link"
      className="hover:no-underline"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      {label || "Back to course setup"}
    </Button>
  );
};

export default BackButton;
