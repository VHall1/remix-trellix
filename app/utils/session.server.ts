import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(
  process.env.SESSION_SECRET,
  "🚨 No SESSION_SECRET environment variable set"
);

const {
  getSession: getSessionFromCookie,
  commitSession,
  destroySession,
} = createCookieSessionStorage<SessionData>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    // 14 days
    maxAge: 60 * 60 * 24 * 14,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV !== "development",
  },
});

const getSessionFromRequest = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  return getSessionFromCookie(cookie);
};

const getUserIdFromRequest = async (request: Request) => {
  const session = await getSessionFromRequest(request);
  return session.get("userId");
};

const requireUserIdFromRequest = async (request: Request) => {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    throw redirect("/login");
  }
  return userId;
};

export {
  commitSession,
  destroySession,
  getSessionFromCookie,
  getSessionFromRequest,
  getUserIdFromRequest,
  requireUserIdFromRequest,
};
