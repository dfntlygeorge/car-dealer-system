"use client";

import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { CircleCheckIcon, CircleX, Loader2 } from "lucide-react";
import { SignInAction } from "@/app/_actions/sign-in";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full font-bold uppercase"
      type="submit"
      disabled={pending}
    >
      {pending && (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      )}{" "}
      Sign In
    </Button>
  );
};

export const SignInForm = () => {
  const [state, formAction] = useActionState(SignInAction, {
    success: false,
    message: "",
  });

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      router.refresh();
      router.push(routes.challenge);
    }
  }, [state, router]);
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md pb-60">
        <form
          action={formAction}
          ref={formRef}
          className="border-muted rounded-md border bg-white p-10 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-center">
            <h2 className="text-2xl font-bold uppercase">Admin Sign In</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                className="placeholder:text-gray-500"
                placeholder="Enter your administrator email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="password"
                className="placeholder:text-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="my-6">
              <p className="mb-2 text-center text-sm text-gray-600">
                <b>This is for admin only.</b>
              </p>
            </div>
            <div className="space-y-4">
              <SubmitButton />
              {state.success && (
                <div className="flex items-center gap-2 rounded-md bg-green-500 p-3 text-white">
                  <CircleCheckIcon className="h-5 w-5" />
                  <span>Success! {state.message}</span>
                </div>
              )}
              {!state.success && state.message && (
                <div className="flex items-center gap-2 rounded-md bg-red-500 p-3 text-white">
                  <CircleX className="h-5 w-5" />
                  <span>Error! {state.message}</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
