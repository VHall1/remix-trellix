import { useDraggable } from "@dnd-kit/core";
import { SerializeFrom } from "@remix-run/node";
import { Card } from "~/components/ui/card";
import { loader } from "./route";

type SerialisedStory = SerializeFrom<
  typeof loader
>["boardData"]["lists"][number]["stories"][number];

export function Story({ story }: { story: SerialisedStory }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `story-${story.id}`,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {story.title}
    </Card>
  );
}
