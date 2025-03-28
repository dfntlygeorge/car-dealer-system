"use client";

import { subscribeAction } from "@/app/_actions/subscribe";
import { SubscribeSchema } from "@/app/_schemas/subscribe.schema";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleCheckIcon, CircleX, Loader2 } from "lucide-react";

export const NewsletterForm = () => {
  // helps manage server actions' state on the client side. It simplifies handling form validation, submission state, and errors without requiring additional state management tools like useState or useReducer.
  const [state, formAction, isPending] = useActionState(subscribeAction, {
    success: false,
    message: "",
  });

  const form = useForm({
    resolver: zodResolver(SubscribeSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleFormAction = async (formData: FormData) => {
    const valid = await form.trigger(); // manually triggerr input validation
    if (!valid) return;
    // fixes concurrent transition issue
    startTransition(() => {
      formAction(formData);
    });
  };

  const formRef = useRef<HTMLFormElement>(null); // reference a value that is not needed for rendering.

  useEffect(() => {
    if (state.success && formRef.current) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <div className="space-y-4">
      <h3 className="text-primary text-xl font-bold">
        Subscribe to our inventory updates
      </h3>
      <p className="text-gray-700">
        Enter your details to receive new stock updates
      </p>
      <Form {...form}>
        <form
          action={handleFormAction}
          ref={formRef}
          className="space-y-2"
          onSubmit={() => null}
        >
          <div className="grid grid-cols-2 space-x-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    className="w-full bg-white"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full font-bold uppercase"
          >
            {isPending && (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            )}
            Subscribe Now
          </Button>

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
        </form>
      </Form>
    </div>
  );
};
