import { getSessionFromRequest } from "./session.server";

export const themeKeys = ["dark", "light"] as const;
export type Theme = (typeof themeKeys)[number];

export async function getThemeFromRequest(request: Request) {
  const session = await getSessionFromRequest(request);
  return session.get("theme");
}

export function isValidTheme(theme: string): theme is Theme {
  return themeKeys.includes(theme as Theme);
}
