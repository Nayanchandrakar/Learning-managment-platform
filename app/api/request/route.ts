import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { formSchema } from "@/schema/zodSchema";
import prismadb from "@/lib/prismadb";

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized user", { status: 401 });
    }

    const body = await req.json();

    const { name, description, email } = formSchema.parse(body);

    const userExist = await prismadb.requests.findFirst({
      where: {
        userId,
      },
    });

    if (userExist) {
      return new Response(
        "Email already in use please try with different email",
        { status: 402 }
      );
    }

    const create = await prismadb.requests.create({
      data: {
        name,
        email,
        userId,
        description,
      },
    });

    return await NextResponse.json({
      status: 200,
      message: "user request succefull",
    });
  } catch (error) {
    console.log(`[ERROR_FROM_REQUESTS_POST]`, error);
    return new Response("Internal error", { status: 500 });
  }
};
