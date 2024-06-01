import { Theme } from "~/utils/theme";

declare global {
  type SessionData = {
    userId: string;
    theme: Theme;
  };
}

export { };

