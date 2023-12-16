import { FC } from "react";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

interface ControlsProps {}

const Controls: FC<ControlsProps> = ({}) => {
  return (
    <div className="flex space-x-2">
      <Button size="sm" variant="ghost" className="border border-zinc-200">
        <LogIn className=" w-4 h-4 mr-2" />
        Login
      </Button>
    </div>
  );
  1;
};

export default Controls;
