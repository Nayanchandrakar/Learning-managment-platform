import { FC } from "react";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  return (
    <div className="relative w-full max-w-[30rem]">
      <Search className="absolute top-3 w-4 h-4 left-3  text-muted-foreground" />
      <Input
        placeholder="Search for a Course"
        className="px-9 flex items-center"
      />
    </div>
  );
};

export default SearchBar;
