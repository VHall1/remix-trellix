import { useDroppable } from "@dnd-kit/core";
import { SerializeFrom } from "@remix-run/node";
import { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { NewStory } from "./new-story";
import { loader } from "./route";

type SerialisedList = SerializeFrom<
  typeof loader
>["boardData"]["lists"][number];

export function List({
  list,
  children,
}: {
  list: SerialisedList;
  children: ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `list-${list.id}` });
  const style = {
    borderColor: isOver ? "green" : undefined,
  };

  return (
    <Card className="p-2" key={list.id} ref={setNodeRef} style={style}>
      <div className="py-1.5 pr-2 pl-3">
        <h2>{list.name}</h2>
      </div>
      <div className="flex flex-col gap-2">
        {children}
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" size="sm" className="w-full">
              New story
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <NewStory listId={list.id} />
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
}
