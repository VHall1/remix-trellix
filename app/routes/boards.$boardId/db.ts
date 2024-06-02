import { db } from "~/utils/db.server";

export async function createList(
  userId: string,
  boardId: string,
  name: string
) {
  return db.list.create({
    data: { name, board: { connect: { id: boardId, userId } } },
  });
}

export async function createStory(
  userId: string,
  boardId: string,
  listId: string,
  title: string
) {
  return db.story.create({
    data: {
      title,
      order: 0,
      list: { connect: { id: listId } },
      board: { connect: { id: boardId, userId } },
    },
  });
}
