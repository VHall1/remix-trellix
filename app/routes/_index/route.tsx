import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Shell } from "~/components/shell";
import { Card } from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { db } from "~/utils/db.server";
import { requireUserIdFromRequest } from "~/utils/session.server";
import { createBoard } from "./db";
import { NewBoard } from "./new-board";

export default function Index() {
  const { boards } = useLoaderData<typeof loader>();

  return (
    <Shell>
      <div className="mt-10 container max-w-screen-2xl">
        <div className="mb-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Your boards
          </h3>
        </div>
        <div className="flex gap-4">
          {boards.map((board) => (
            <Link to={`/boards/${board.id}`} key={board.id}>
              <Card className="flex items-start justify-start font-bold pt-4 pl-5 w-[200px] min-h-[96px]">
                {board.name}
              </Card>
            </Link>
          ))}
          <Popover>
            <PopoverTrigger>
              <Card className="flex items-center justify-center w-[200px] min-h-[96px]">
                Create new board
              </Card>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <NewBoard />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Shell>
  );
}

export const schema = z.object({
  name: z.string().min(3, "Board name has to be at least 3 characters long"),
});

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserIdFromRequest(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await createBoard(userId, submission.value.name);
  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserIdFromRequest(request);
  const boards = await db.board.findMany({
    where: { userId },
    select: { id: true, name: true },
  });
  return { boards };
}
