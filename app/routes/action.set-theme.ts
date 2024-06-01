import { type ActionFunctionArgs } from "@remix-run/node";
import { commitSession, getSessionFromRequest } from "~/utils/session.server";
import { isValidTheme } from "~/utils/theme";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme")?.toString();
  if (!theme || !isValidTheme(theme)) {
    throw new Response(undefined, { status: 400 });
  }
  const session = await getSessionFromRequest(request);
  session.set("theme", theme);
  return new Response(undefined, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
