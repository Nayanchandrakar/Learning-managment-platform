"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
}

const BackButton: FC<BackButtonProps> = ({ label }) => {
  return (
    <Button variant="ghost">
      <ArrowLeft className="w-5 h-5 mr-2" />
      {label || "Back to course setup"}
    </Button>
  );
};

export default BackButton;
