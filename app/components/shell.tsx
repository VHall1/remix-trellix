import { Link } from "@remix-run/react";
import { SquareKanbanIcon } from "lucide-react";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function Shell({ children }: { children: ReactNode }) {
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
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="pt-6 flex-1 container max-w-screen-2xl">{children}</main>
    </div>
  );
}
