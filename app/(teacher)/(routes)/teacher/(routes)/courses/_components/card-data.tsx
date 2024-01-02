import { CardHeader, CardContent, CardTitle, Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { FC } from "react";

interface CardProps {
  title: string;
  data: string | number;
  Icon: LucideIcon;
}

const CardData: FC<CardProps> = ({ data, title, Icon }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data}</div>
      </CardContent>
    </Card>
  );
};

export default CardData;
