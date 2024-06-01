import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserIdFromRequest } from "~/utils/session.server";

export default function Index() {
  const { userId } = useLoaderData<typeof loader>();

  return <div>{userId}</div>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserIdFromRequest(request);
  return { userId };
}
