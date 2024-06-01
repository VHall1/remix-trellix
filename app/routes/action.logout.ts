import { type ActionFunctionArgs } from "@remix-run/node";
import { commitSession, getSessionFromRequest } from "~/utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSessionFromRequest(request);
  session.unset("userId");
  return new Response(undefined, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
