import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Shell } from "~/components/shell";
import { requireUserIdFromRequest } from "~/utils/session.server";

export default function Index() {
  const { userId } = useLoaderData<typeof loader>();

  return <Shell>{userId}</Shell>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserIdFromRequest(request);
  return { userId };
}
