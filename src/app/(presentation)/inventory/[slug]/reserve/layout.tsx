import { FormHeader } from "@/components/reserve/form-header";
import { PropsWithChildren } from "react";

export default function MultiStepFormLayout({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-8 md:p-10">
      <FormHeader />
      {children}
    </main>
  );
}
