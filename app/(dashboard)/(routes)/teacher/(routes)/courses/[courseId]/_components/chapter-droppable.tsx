"use client";
import { FC } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChapterDroppableProps {
  chapters: {
    title: string | null;
    id: string;
    isFree: boolean;
    isPublished: boolean;
  }[];
  handleToogle: (chapterId: string) => void;
  onDragEnd: (result: any) => void;
}

const ChapterDroppable: FC<ChapterDroppableProps> = ({
  chapters,
  handleToogle,
  onDragEnd,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className=""
          >
            <div className="space-y-3">
              {chapters?.map((chapter, index) => (
                <Draggable
                  key={chapter?.id}
                  draggableId={chapter?.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided?.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      key={chapter?.id}
                      className={cn(
                        "w-full h-13  flex justify-between items-center flex-row border border-zinc-300 rounded-lg",
                        chapter?.isPublished ? "bg-sky-100" : "bg-gray-200"
                      )}
                    >
                      {/* first div here  */}
                      <div className="flex flex-row items-center  ">
                        <span className="w-12 h-12 flex items-center justify-center  border-r border-r-zinc-300 ">
                          <GripVertical
                            className={cn(
                              "w-6 h-6 ",
                              chapter?.isPublished
                                ? "text-sky-800"
                                : "text-gray-600"
                            )}
                          />
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium ml-3 ",
                            chapter?.isPublished
                              ? "text-sky-800"
                              : "text-gray-600"
                          )}
                        >
                          {chapter?.title}
                        </span>
                      </div>

                      {/* second div here  */}
                      <div className="space-x-3 flex items-center flex-row mr-3">
                        {chapter?.isFree && <Badge className="">Free</Badge>}
                        {
                          <Badge
                            className={cn(
                              chapter?.isPublished
                                ? "bg-cyan-700"
                                : "bg-gray-600"
                            )}
                          >
                            {!chapter?.isPublished ? "Draft" : "Published"}
                          </Badge>
                        }
                        <Pencil
                          onClick={() => handleToogle(chapter?.id)}
                          className={cn(
                            "w-5 h-5 cursor-pointer",
                            chapter?.isPublished
                              ? "text-cyan-700"
                              : "text-gray-600"
                          )}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterDroppable;
