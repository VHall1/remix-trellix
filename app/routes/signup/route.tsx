import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Prisma } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { commitSession, getSessionFromRequest } from "~/utils/session.server";
import { signup } from "./db";

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
          <CardTitle className="text-2xl text-center">Sign up</CardTitle>
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
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="login" className="underline">
                Log in
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
  password: z.string().min(8, "Password has to be at least 8 characters long"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let user;
  try {
    user = await signup(submission.value.email, submission.value.password);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return submission.reply({
          formErrors: ["An account with this email already exists"],
        });
      }
    }
    throw e;
  }

  const session = await getSessionFromRequest(request);
  session.set("userId", user.id);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
