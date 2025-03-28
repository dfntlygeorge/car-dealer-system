import { routes } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { HeartIcon, MenuIcon } from "lucide-react";
import { redis } from "@/lib/redit-store";
import { Favourites } from "@/config/types";
import { getSourceId } from "@/lib/source-id";
import { navLinks } from "@/config/constants";

export const PublicHeader = async () => {
  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  return (
    <header className="flex h-16 items-center justify-between gap-x-6 bg-transparent px-4">
      <div className="flex flex-1 items-center">
        <Link href={routes.home} className="flex items-center gap-2">
          <Image
            width={300}
            height={100}
            src="/logo.svg"
            alt="logo"
            className="relative h-10"
          />
        </Link>
      </div>
      <nav className="hidden md:block">
        {navLinks.map((link) => (
          <Link
            key={link.id}
            className="group font-heading text-foreground hover:text-primary rounded px-3 py-2 text-base font-semibold uppercase transition-all duration-300 ease-in-out"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="group relative inline-block"
      >
        <Link href={routes.favourites}>
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 ease-in-out group-hover:bg-pink-500">
            <HeartIcon className="text-primary h-6 w-6 group-hover:fill-white group-hover:text-white" />
          </div>
          <div className="group-hover:bg-primary absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-white">
            <span className="text-xs">
              {favourites ? favourites.ids.length : 0}
            </span>
          </div>
        </Link>
      </Button>
      {/* mobile nav bar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" size="icon" className="border-none md:hidden">
            <MenuIcon className="text-primary h-6 w-6" />
            <SheetTitle className="sr-only">Toggle nav menu</SheetTitle>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-xs bg-white p-4">
          <nav className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                className="flex items-center gap-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};
