import crypto from "crypto";
import { db } from "~/utils/db.server";

export async function login(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
    include: { password: true },
  });
  if (!user || !user.password) return null;

  const hash = crypto
    .pbkdf2Sync(password, user.password.salt, 1000, 64, "sha256")
    .toString("hex");
  if (hash !== user.password.hash) return null;

  return user.id;
}
