import Link from "next/link";
import { Button } from "../ui/button";
import { CarIcon, HomeIcon } from "lucide-react";
import { routes } from "@/config/routes";

export const EndButtons = () => {
  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        className="hover:bg-primary transition-colors hover:border-white hover:text-white"
        asChild
      >
        <Link href={routes.home}>
          <HomeIcon />
          Go to Homepage
        </Link>
      </Button>
      <Button asChild>
        <Link href={routes.inventory}>
          <CarIcon />
          View Classifieds
        </Link>
      </Button>
    </div>
  );
};
