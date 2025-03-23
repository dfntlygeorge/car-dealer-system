"use client";
import { routes } from "@/config/routes";
import { ClassifiedWithImages, MultiStepFormEnum } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { HTMLParser } from "../shared/html-parser";
import { Cog, Fuel, GaugeCircle, Paintbrush } from "lucide-react";
import { Button } from "../ui/button";
import { FavouriteButton } from "./favourite-button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  formatColour,
  formatFuelType,
  formatNumber,
  formatOdometerUnit,
  formatPrice,
  formatTransmission,
} from "@/lib/utils";

interface ClassifiedCardProps {
  classified: ClassifiedWithImages;
  favourites: number[];
}

// This is for the metadata around the classified
const getKeyClassifiedInfo = (classified: ClassifiedWithImages) => {
  return [
    {
      id: "odoReading",
      icon: <GaugeCircle className="h-4 w-4" />,
      value: `${formatNumber(classified.odoReading)} ${formatOdometerUnit(
        classified.odoUnit,
      )}`,
    },
    {
      id: "transmission",
      icon: <Cog className="h-4 w-4" />,
      value: classified.transmission
        ? formatTransmission(classified.transmission)
        : null,
    },
    {
      id: "fuelType",
      icon: <Fuel className="h-4 w-4" />,
      value: classified.fuelType ? formatFuelType(classified.fuelType) : null,
    },
    {
      id: "colour",
      icon: <Paintbrush className="h-4 w-4" />,
      value: classified.colour ? formatColour(classified.colour) : null,
    },
  ];
};

export const ClassifiedCard = (props: ClassifiedCardProps) => {
  // destructuring the props so we don't have to use props.classified everywhere
  const { classified, favourites } = props;
  // gets us the current pathname
  const pathname = usePathname();

  const [isFavourite, setIsFavourite] = useState(
    favourites.includes(classified.id), // check if the classified is in the favourites array
  );

  const [isVisible, setIsVisible] = useState(true);
  // hides non-favourite cards on the favourites page
  useEffect(() => {
    if (!isFavourite && pathname === routes.favourites) setIsVisible(false);
  }, [isFavourite, pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md"
        >
          <div className="relative aspect-3/2">
            <Link href={routes.singleClassified(classified.slug)}>
              <Image
                placeholder="blur"
                blurDataURL={classified.images[0]?.blurhash}
                src={classified.images[0]?.src}
                alt={classified.images[0]?.alt}
                className="object-cover"
                fill={true}
                quality={25}
              />
            </Link>
            <FavouriteButton
              setIsFavourite={setIsFavourite}
              isFavourite={isFavourite}
              id={classified.id}
            />
            <div className="bg-primary absolute top-2.5 right-3.5 rounded px-2 py-1 font-bold text-slate-50">
              <p className="text-xs font-semibold lg:text-base xl:text-lg">
                {formatPrice({
                  price: classified.price,
                  currency: classified.currency,
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-3 p-4">
            <div>
              <Link
                href={routes.singleClassified(classified.slug)}
                className="line-clamp-1 text-sm font-semibold hover:underline md:text-base lg:text-lg"
              >
                {classified.title}
              </Link>
              {classified?.description && (
                <div className="line-clamp-2 text-xs text-gray-500 md:text-sm xl:text-base">
                  {/* Sanitizes the html and parses it so it can be rendered in the browser safely */}
                  <HTMLParser html={classified.description} />
                  &nbsp;{" "}
                  {/* Use for equal spacing across each card in the grid */}
                </div>
              )}
              <ul className="grid w-full grid-cols-1 grid-rows-4 items-center justify-between text-xs text-gray-600 md:grid-cols-2 md:grid-rows-4 md:text-sm xl:flex">
                {getKeyClassifiedInfo(classified)
                  .filter((v) => v.value) // filter out any values that are null
                  .map(
                    (
                      { id, icon, value }, //destructure the id, icon and value from the object
                    ) => (
                      <li
                        key={id}
                        className="flex items-center gap-x-1.5 font-semibold xl:flex-col"
                      >
                        {icon} <span className="line-clamp-1">{value}</span>
                      </li>
                    ),
                  )}
              </ul>
            </div>
            {/* Just buttons for call to action */}
            <div className="mt-4 flex w-full flex-col space-y-2 lg:flex-row lg:space-y-0 lg:gap-x-2">
              <Button
                className="hover:bg-primary h-full flex-1 py-2 text-xs transition-colors hover:border-white hover:text-white md:text-sm lg:py-2.5 xl:text-base"
                asChild
                variant="outline"
                size="sm"
              >
                <Link
                  href={routes.reserve(
                    classified.slug,
                    MultiStepFormEnum.WELCOME,
                  )}
                >
                  Reserve
                </Link>
              </Button>

              <Button
                className="h-full flex-1 py-2 text-xs md:text-sm lg:py-2.5 xl:text-base"
                asChild
                size="sm"
              >
                <Link href={routes.singleClassified(classified.slug)}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
