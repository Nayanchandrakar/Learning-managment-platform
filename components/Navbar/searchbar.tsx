"use client";

import { FC, useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { cn } from "@/lib/utils";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => {
  const [value, setValue] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const handleSearch = (searchValue: string) => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          categoryId,
          title: searchValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router?.push(url);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e?.code === "Enter") {
      handleSearch(value);
    }
  };

  const handleClear = () => {
    setValue("");
    handleSearch("");
  };

  return (
    <div className="relative w-full transition-colors">
      <Input
        onChange={(e) => setValue(e?.target?.value)}
        onKeyUp={handleEnter}
        value={value}
        placeholder="Search for a Course"
        className="pr-9 flex items-center
         focus-visible:ring-0  focus-visible:ring-offset-0 "
      />
      <span
        onClick={handleClear}
        className={cn(
          "absolute top-0  h-full w-10 right-12 flex items-center justify-center   duration-300 hover:bg-slate-200 cursor-pointer",
          !value && "hidden"
        )}
      >
        <X className="w-4 h-4 text-gray-800 " />
      </span>

      <span
        onClick={() => handleSearch(value)}
        className=" absolute top-0  h-full w-12 bg-sky-700 right-0 flex items-center justify-center rounded-r-lg transition-colors duration-300 hover:opacity-80 cursor-pointer"
      >
        <Search className="w-4 h-4 text-white " />
      </span>
    </div>
  );
};

export default SearchBar;
