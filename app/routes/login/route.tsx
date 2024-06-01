import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { commitSession, getSessionFromRequest } from "~/utils/session.server";
import { login } from "./db";

export default function Signup() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <main className="py-12">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={fields.email.id}>Email</Label>
                <Input
                  id={fields.email.id}
                  name={fields.email.name}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                <small className="text-sm font-medium leading-none text-destructive">
                  {fields.email.errors}
                </small>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor={fields.password.id}>Password</Label>
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id={fields.password.id}
                  name={fields.password.name}
                  type="password"
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
                <small className="text-sm font-medium leading-none text-destructive">
                  {fields.password.errors}
                </small>
              </div>
              <small className="text-sm font-medium leading-none text-destructive">
                {form.errors}
              </small>
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const userId = await login(submission.value.email, submission.value.password);
  if (!userId) {
    return submission.reply({ formErrors: ["Invalid email or password"] });
  }

  const session = await getSessionFromRequest(request);
  session.set("userId", userId);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
