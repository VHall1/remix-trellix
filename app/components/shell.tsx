import { Link, useFetcher, useRouteLoaderData } from "@remix-run/react";
import { CheckIcon, SquareKanbanIcon } from "lucide-react";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { loader } from "~/root";
import { Theme } from "~/utils/theme";

export function Shell({ children }: { children: ReactNode }) {
  const rootLoaderData = useRouteLoaderData<typeof loader>("root");
  const userEmail = rootLoaderData?.userEmail;
  const theme = rootLoaderData?.theme;

  const logoutFetcher = useFetcher();
  const logout = () => {
    logoutFetcher.submit(null, {
      method: "post",
      action: "/action/logout",
    });
  };

  const setThemeFetcher = useFetcher();
  const setTheme = (nextTheme: Theme) => {
    if (theme === nextTheme) return;
    setThemeFetcher.submit(
      { theme: nextTheme },
      { method: "post", action: "/action/set-theme" }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container flex h-12 max-w-screen-2xl items-center">
          <div className="flex flex-1">
            <Link to="/" className="flex items-center">
              <SquareKanbanIcon />
              <span className="ml-2 font-bold">Trellix</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <div className="flex items-center px-2 py-1.5">
                    <Avatar className="w-10 h-10 mr-2">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">Frk</p>
                      <p className="text-xs text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                    Trellix
                  </DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Colour scheme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          {theme === "dark" ? (
                            <CheckIcon className="w-3 h-3 mr-1.5" />
                          ) : null}
                          Dark mode
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          {theme === "light" ? (
                            <CheckIcon className="w-3 h-3 mr-1.5" />
                          ) : null}
                          Light mode
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="pt-6 flex-1 container max-w-screen-2xl">{children}</main>
    </div>
  );
}
