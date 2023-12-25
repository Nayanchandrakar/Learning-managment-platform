import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { requests } from "@prisma/client";

const errorHandle: requests = {
  userId: "",
  email: "",
  description: "",
  isApproved: false,
  id: "",
  name: "",
};

export const getRequest = async (): Promise<requests | null> => {
  try {
    const { userId } = auth();

    if (!userId) {
      return errorHandle;
    }

    const requests = await prismadb.requests.findFirst({
      where: {
        userId,
      },
    });

    return requests;
  } catch (error) {
    return errorHandle;
  }
};
