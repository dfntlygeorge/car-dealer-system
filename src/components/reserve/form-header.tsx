"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export const FormHeader = () => {
  const params = useSearchParams();
  const steps = [
    { id: "1", title: "Welcome" },
    { id: "2", title: "Select Handover Date" },
    { id: "3", title: "Submit Details" },
  ];
  return (
    <div className="bg-primary flex justify-between p-4 shadow-lg">
      <div className="flex flex-1 flex-col justify-between">
        <h1 className="text-3xl font-bold text-white">
          {steps.find(({ id }) => params.get("step") === id)?.title}
        </h1>
      </div>
      <div className="text-muted-foreground flex flex-1 items-center justify-end gap-2 text-sm font-medium">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              params.get("step") === step.id
                ? "text-muted-foreground bg-white"
                : "bg-primary text-primary-foreground",
            )}
          >
            {step.id}
          </div>
        ))}
      </div>
    </div>
  );
};
