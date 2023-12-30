import { revalidateTag } from "next/cache";

export const revalidateServer = async (path: string) => revalidateTag(path);
