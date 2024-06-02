import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { action, storySchema } from "./route";

export function NewStory({ listId }: { listId: string }) {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: storySchema });
    },
  });

  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
      <input type="hidden" name="listId" value={listId} />
      <div className="grid gap-4">
        <h4 className="font-medium leading-none">Create story</h4>
        <div className="grid gap-2">
          <Label htmlFor={fields.title.id}>Story title</Label>
          <Input id={fields.title.id} name={fields.title.name} />
          <small className="text-sm font-medium leading-none text-destructive">
            {fields.title.errors}
          </small>
        </div>
        <small className="text-sm font-medium leading-none text-destructive">
          {form.errors}
        </small>
        <Button type="submit" name="intent" value="story">
          Create story
        </Button>
      </div>
    </Form>
  );
}
