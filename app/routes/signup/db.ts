import crypto from "crypto";
import { db } from "~/utils/db.server";

export async function signup(email: string, password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha256")
    .toString("hex");

  return db.user.create({
    data: { email, password: { create: { hash, salt } } },
  });
}
