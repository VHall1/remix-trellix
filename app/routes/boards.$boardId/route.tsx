import { parseWithZod } from "@conform-to/zod";
import { DndContext } from "@dnd-kit/core";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { db } from "~/utils/db.server";
import { requireUserIdFromRequest } from "~/utils/session.server";
import { createList, createStory } from "./db";
import { NewList } from "./new-list";
import { NewStory } from "./new-story";
import { Story } from "./story";

export default function Board() {
  const { boardData } = useLoaderData<typeof loader>();

  return (
    <DndContext>
      <Shell>
        <div className="p-2 h-[calc(100vh-49px)] overflow-x-auto">
          <div className="grid grid-flow-col items-start auto-cols-[280px] gap-2">
            {boardData.lists.map((list) => (
              <Card className="p-2" key={list.id}>
                <div className="py-1.5 pr-2 pl-3">
                  <h2>{list.name}</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {list.stories.map((story) => (
                    <Story story={story} key={story.id} />
                  ))}
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
            ))}
            <Popover>
              <PopoverTrigger>
                <Card className="p-2">Add another list</Card>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <NewList />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Shell>
    </DndContext>
  );
}

export const listSchema = z.object({
  name: z.string(),
});

export const storySchema = z.object({
  title: z.string(),
  listId: z.string(),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const boardId = params.boardId;
  if (!boardId) return null;
  const userId = await requireUserIdFromRequest(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "list": {
      const submission = parseWithZod(formData, { schema: listSchema });
      if (submission.status !== "success") {
        return submission.reply();
      }
      await createList(userId, boardId, submission.value.name);
      break;
    }
    case "story": {
      const submission = parseWithZod(formData, { schema: storySchema });
      if (submission.status !== "success") {
        return submission.reply();
      }
      await createStory(
        userId,
        boardId,
        submission.value.listId,
        submission.value.title
      );
      break;
    }
    default:
      throw "Unhandled intent type";
  }

  return null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const boardId = params.boardId;
  if (!boardId) throw redirect("/");
  const userId = await requireUserIdFromRequest(request);
  const boardData = await db.board.findUnique({
    where: { id: boardId, userId },
    select: {
      lists: {
        select: {
          id: true,
          name: true,
          stories: { select: { id: true, title: true } },
        },
      },
    },
  });
  if (!boardData) throw redirect("/");
  return { boardData };
}
