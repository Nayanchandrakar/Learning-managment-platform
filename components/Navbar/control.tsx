"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { LogIn, BookOpenText } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTeaherModal } from "@/hooks/use-teacher-modal";

const Controls = () => {
  const { userId } = useAuth();
  const teacherModal = useTeaherModal();

  return (
    <div className="flex space-x-2">
      {userId ? (
        <>
          <Button
            variant="ghost"
            className="border border-zinc-200 mr-2"
            size="sm"
            onClick={() => teacherModal?.onOpen()}
          >
            <BookOpenText className="w-4 h-4 mr-2" />
            Teacher Mode
          </Button>
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="border border-zinc-200"
          >
            <Link href="/sign-up">
              <LogIn className=" w-4 h-4 mr-2" />
              Login
            </Link>
          </Button>
        </>
      )}
    </div>
  );
  1;
};

export default Controls;
