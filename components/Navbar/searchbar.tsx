"use client";

import { FC, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import qs from "query-string";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => {
  const [value, setValue] = useState<string>("");

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceValue = useDebounce(value);
  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId,
          title: debounceValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router?.push(url);
  }, [pathname, categoryId, debounceValue, router]);

  return (
    <div className="relative w-full max-w-[30rem] md:inline-block hidden">
      <Search className="absolute top-3 w-4 h-4 left-3  text-muted-foreground" />
      <Input
        onChange={(e) => setValue(e?.target?.value)}
        placeholder="Search for a Course"
        className="px-9 flex items-center"
      />
    </div>
  );
};

export default SearchBar;
