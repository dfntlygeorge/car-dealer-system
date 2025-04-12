"use client";

import { MultiStepFormComponentProps, MultiStepFormEnum } from "@/config/types";
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CreditCardIcon,
  Loader2,
  LockIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { HTMLParser } from "../shared/html-parser";
import { Button } from "../ui/button";

export const Welcome = (props: MultiStepFormComponentProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition(); // Hook to manage UI during async transitions (shows a spinner while transitioning).

  const nextStep = () => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
      router.push(url.toString());
    });
  };

  return (
    <div className="mx-auto rounded-b-lg bg-white shadow-lg">
      <div className="p-6">
        <div className="flex justify-between gap-x-12">
          <div className="flex-1">
            <div className="mb-4 flex items-start">
              <CircleCheckIcon className="mr-2 h-6 w-6 text-green-500" />
              <p className="text-gray-700">
                Reserve in two minutes with two simple steps
              </p>
            </div>
            <div className="mb-4 flex items-start">
              <CircleCheckIcon className="mr-2 h-6 w-6 text-green-500" />
              <p className="text-gray-700">
                Arrange a handover date for your new vehicle
              </p>
            </div>
          </div>
          <div className="flex flex-1 space-x-2">
            <div className="relative h-16 w-16">
              <Image
                src={props.classified.make.image}
                alt={props.classified.make.name}
                width={100}
                height={100}
                className="aspect-1/1 object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="line-clamp-1 text-lg font-semibold">
                {props.classified.title}
              </h2>
              <div className="line-clamp-2 text-xs">
                <HTMLParser html={props.classified.description ?? ""} />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-around rounded-md bg-gray-100 p-4">
          <div className="text-center">
            <p className="font-bold">Select Handover Data & Time</p>
            <p className="text-gray-500">approx. 1 minute</p>
          </div>
          <ArrowRightIcon className="h-6 w-6" />
          <div className="text-center">
            <p className="font-bold">Submit your Details</p>
            <p className="text-gray-500">approx. 1 minute</p>
          </div>
        </div>
        <p className="mb-4 font-bold">Ready to begin?</p>
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center justify-center space-y-2">
            <LockIcon className="h-6 w-6" />
            <p className="text-gray-700">SSL Secure</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <StarIcon className="h-6 w-6" />
            <p className="text-gray-700">Trustpilot</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <CreditCardIcon className="h-6 w-6" />
            <p className="text-gray-700">Stripe</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <Button
          type="button"
          onClick={nextStep}
          disabled={isPending}
          className="flex w-full gap-x-3 font-bold uppercase"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : null}{" "}
          I&apos;m Ready
        </Button>
      </div>
    </div>
  );
};
