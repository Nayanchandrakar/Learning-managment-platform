import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { FC } from "react";

interface ChapterHeaderActionsProps {
  headerText: string;
  check: boolean;
}

const ChapterHeaderActions: FC<ChapterHeaderActionsProps> = ({
  headerText,
  check,
}) => {
  return (
    <div className="flex justify-between items-center flex-row  py-5">
      <div className="flex flex-col items-start justify-center space-y-2">
        <h2 className="text-lg md:text-xl font-semibold ">Chapter creation</h2>
        <p className="text-zinc-500 text-sm md:text-base">{headerText}</p>
      </div>
      <div className="flex flex-row items-center space-x-3">
        <Button
          disabled={!check}
          className="disabled:opacity-60"
          variant="outline"
        >
          Publish
        </Button>
        <Button>
          <Trash className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterHeaderActions;
