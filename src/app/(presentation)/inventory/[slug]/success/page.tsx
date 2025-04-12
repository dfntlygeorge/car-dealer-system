import { EndButtons } from "@/components/shared/end-buttons";
import { CircleCheck } from "lucide-react";

export default function SuccessReservationPage() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleCheck className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="font-bol text-foreground mt-4 text-3xl tracking-tight sm:text-4xl">
          Reservation Confirmed!
        </h1>
        <p className="text-muted-foreground mt-4">
          Thank you for your reservation. We&apos;ll see you soon.
        </p>
        <EndButtons />
      </div>
    </div>
  );
}
