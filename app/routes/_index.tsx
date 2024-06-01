import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSessionFromRequest } from "~/utils/session.server";

export default function Index() {
  const { userId } = useLoaderData<typeof loader>();

  return <div>{userId}</div>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromRequest(request);
  const userId = session.get("userId");
  return { userId };
}
