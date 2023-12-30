import { LucideIcon } from "lucide-react";
import { FC } from "react";

interface ActionTitleProps {
  Icon: LucideIcon;
  title: string;
}

const ActionTitle: FC<ActionTitleProps> = ({ Icon, title }) => {
  return (
    <div className="w-full h-fit p-1 flex items-center justify-between flex-row ">
      <span className="w-12 h-12 rounded-full bg-sky-200 flex items-center justify-center">
        <Icon className="w-5 h-5 text-sky-600" />
      </span>
      <span className="text-sm font-semibold text-sky-600">{title}</span>
    </div>
  );
};

export default ActionTitle;
