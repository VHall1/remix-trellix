import { db } from "~/utils/db.server";

export async function createBoard(userId: string, name: string) {
  return db.board.create({
    data: { userId, name },
  });
}
