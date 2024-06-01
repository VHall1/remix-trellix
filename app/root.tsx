import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import tailwind from "~/styles/tailwind.css?url";
import { cn } from "~/utils/cn";
import { db } from "~/utils/db.server";
import { getUserIdFromRequest } from "~/utils/session.server";
import { getThemeFromRequest } from "~/utils/theme";

export function Layout({ children }: { children: React.ReactNode }) {
  const rootLoaderData = useRouteLoaderData<typeof loader>("root");
  const theme = rootLoaderData?.theme;

  return (
    <html className={cn({ dark: theme !== "light" })} lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link rel="stylesheet" href={tailwind} />
        <Links />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const [userId, theme] = await Promise.all([
    getUserIdFromRequest(request),
    getThemeFromRequest(request),
  ]);
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  return { theme, userEmail: user?.email };
}
