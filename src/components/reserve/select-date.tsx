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
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { routes } from "@/config/routes";
import { generateDateOptions, generateTimeOptions } from "@/lib/utils";
import { env } from "@/env";
import { SelectDateSchema, SelectDateType } from "@/app/_schemas/form.schema";

export const SelectDate = (props: MultiStepFormComponentProps) => {
  const { searchParams } = props;

  const handoverDate = (searchParams?.handoverDate as string) ?? undefined;
  const handoverTime = (searchParams?.handoverTime as string) ?? undefined;

  const form = useForm<SelectDateType>({
    resolver: zodResolver(SelectDateSchema),
    mode: "onBlur",
    defaultValues: {
      handoverDate: handoverDate
        ? decodeURIComponent(handoverDate)
        : handoverDate,
      handoverTime: handoverTime
        ? decodeURIComponent(handoverTime)
        : handoverTime,
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.WELCOME.toString());
      router.push(url.toString());
    });
  };

  const onSelectDate: SubmitHandler<SelectDateType> = (data) => {
    startTransition(async () => {
      const valid = form.trigger();
      if (!valid) return;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const url = new URL(
        routes.reserve(props.classified.slug, MultiStepFormEnum.SUBMIT_DETAILS),
        env.NEXT_PUBLIC_APP_URL,
      );

      url.searchParams.set(
        "handoverDate",
        encodeURIComponent(data.handoverDate),
      );
      url.searchParams.set(
        "handoverTime",
        encodeURIComponent(data.handoverTime),
      );

      router.push(url.toString());
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto flex h-96 flex-col rounded-b-lg bg-white p-6 shadow-lg"
        onSubmit={form.handleSubmit(onSelectDate)}
      >
        <div className="flex-1 space-y-6">
          <FormField
            control={form.control}
            name="handoverDate"
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel htmlFor="handoverDate">Select a Date</FormLabel>
                <FormControl>
                  <Select options={generateDateOptions()} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handoverTime"
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel htmlFor="handoverTime">Select a Time</FormLabel>
                <FormControl>
                  <Select options={generateTimeOptions()} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
