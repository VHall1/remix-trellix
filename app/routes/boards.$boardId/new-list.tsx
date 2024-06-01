import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { action, listSchema } from "./route";
import { Button } from "~/components/ui/button";

export function NewList() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: listSchema });
    },
  });

  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
      <div className="grid gap-4">
        <h4 className="font-medium leading-none">Create list</h4>
        <div className="grid gap-2">
          <Label htmlFor={fields.name.id}>List name</Label>
          <Input id={fields.name.id} name={fields.name.name} />
          <small className="text-sm font-medium leading-none text-destructive">
            {fields.name.errors}
          </small>
        </div>
        <small className="text-sm font-medium leading-none text-destructive">
          {form.errors}
        </small>
        <Button type="submit" name="intent" value="list">
          Create list
        </Button>
      </div>
    </Form>
  );
}
