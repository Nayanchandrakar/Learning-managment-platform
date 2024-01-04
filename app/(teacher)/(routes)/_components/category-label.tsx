"use client";

import { cn } from "@/lib/utils";
import { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryLabelProps {
  category: {
    id: string | null;
    name: string;
  };
}

const CategoryLabel: FC<CategoryLabelProps> = ({ category }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const categoryId = searchParams.get("categoryId");
  const title = searchParams.get("title");

  const isActive = !!(category?.id === categoryId);
  const isSetToAll = !!(categoryId === null && category?.name === "All");

  const handleToogle = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: category?.id,
          title,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <div
      onClick={() => handleToogle()}
      className={cn(
        "px-4 py-2 cursor-pointer transition-colors duration-300 bg-gray-100 text-xs font-semibold   rounded-md hover:bg-gray-200 h-fit w-fit whitespace-nowrap",
        (isActive || isSetToAll) && "bg-sky-100 "
      )}
    >
      {category?.name}
    </div>
  );
};

export default CategoryLabel;
