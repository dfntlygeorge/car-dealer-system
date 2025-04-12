"use client";

import { MultiStepFormComponentProps, MultiStepFormEnum } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { formatDate } from "@/lib/utils";
import {
  SubmitDetailsSchema,
  SubmitDetailsSchemaType,
} from "@/app/_schemas/customer.schema";
import { createCustomerAction } from "@/app/_actions/customer";
import { routes } from "@/config/routes";
import { toast } from "sonner";

export const SubmitDetails = (props: MultiStepFormComponentProps) => {
  const { params, searchParams } = props;

  const router = useRouter();
  const form = useForm<SubmitDetailsSchemaType>({
    resolver: zodResolver(SubmitDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      terms: "false",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
      router.push(url.toString());
    });
  };

  const onSubmitDetails: SubmitHandler<SubmitDetailsSchemaType> = (data) => {
    startTransition(async () => {
      const valid = form.trigger();
      if (!valid) return;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const handoverDate = decodeURIComponent(
        searchParams?.handoverDate as string,
      );
      const handoverTime = decodeURIComponent(
        searchParams?.handoverTime as string,
      );

      const date = formatDate(handoverDate, handoverTime);

      const { success, message } = await createCustomerAction({
        slug: params?.slug as string,
        date,
        ...data,
      });

      if (!success) {
        toast.error("Error", {
          description: message,
          duration: 2500,
        });
        return;
      }

      toast.success("Success", {
        description: message,
        duration: 1000,
      });

      setTimeout(() => {
        router.push(routes.success(params?.slug as string));
      }, 1000);
    });
  };
  return (
    <Form {...form}>
      <form
        className="mx-auto flex h-96 flex-col rounded-b-lg bg-white p-6 shadow-lg"
        onSubmit={form.handleSubmit(onSubmitDetails)}
      >
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="firstName">Enter First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
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
                  <FormLabel htmlFor="lastName">Enter Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Enter Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="mobile">Enter Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="terms"
              render={({ field: { ref, onChange, ...rest } }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormControl>
                    <Checkbox
                      className="cursor-pointer"
                      onCheckedChange={(e) => onChange(e ? "true" : "false")}
                      {...rest}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="terms"
                    className="!mt-0 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-x-4">
          <Button
            type="button"
            onClick={prevStep}
            disabled={isPrevPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPrevPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Previous Step
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Submit Details
          </Button>
        </div>
      </form>
    </Form>
  );
};
