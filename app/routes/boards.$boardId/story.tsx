import { SerializeFrom } from "@remix-run/node";
import { Card } from "~/components/ui/card";
import { loader } from "./route";

type SerialisedStory = SerializeFrom<
  typeof loader
>["boardData"]["lists"][number]["stories"][number];

export function Story({ story }: { story: SerialisedStory }) {
  return <Card>{story.title}</Card>;
}
