import prismadb from "@/lib/prismadb";
import { FC } from "react";
import CategoryLabel from "./category-label";

interface CategoryFilterProps {}

const CategoryFilter: FC<CategoryFilterProps> = async ({}) => {
  const categories = await prismadb?.category?.findMany();

  const newCategory = [{ id: null, name: "All" }, ...categories];

  return (
    <div
      className="flex flex-row space-x-3 items-center w-full h-fit overflow-x-scroll md:overflow-auto pb-2"
      id="custom_scrollbar"
    >
      {newCategory?.map((category) => (
        <CategoryLabel key={category?.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryFilter;
