import { imageSources } from "@/config/constants";
import { imgixLoader } from "@/lib/imgix-loader";
import { HomepageTaxonomyFilters } from "./homepage-filters";
import { AwaitedPageProps } from "@/config/types";
import { SearchButton } from "./search-button";
import prisma from "@/lib/prisma";
import { buildClassifiedFilterQuery } from "@/lib/utils";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";
import Link from "next/link";
import { ClassifiedStatus } from "@prisma/client";

export const HeroSection = async (props: AwaitedPageProps) => {
  const { searchParams } = props;
  const totalFiltersApplied = Object.keys(searchParams || {}).length;
  const isFilterApplied = totalFiltersApplied > 0;

  const classfiedsCount = await prisma.classified.count({
    where: buildClassifiedFilterQuery(searchParams),
  });

  const minMaxResult = await prisma.classified.aggregate({
    // aggregate() function is prisma performs aggregations like min, max, sum, avg, etc on a table.
    where: {
      status: ClassifiedStatus.LIVE,
    },
    _min: {
      year: true,
      price: true,
      odoReading: true,
    },
    _max: {
      year: true,
      price: true,
      odoReading: true,
    },
  });
  return (
    <section
      className="relative flex h-[calc(100vh-4rem)] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${imgixLoader({ src: imageSources.carLineup, width: 1200, quality: 100 })})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70" />
      <div className="relative z-10 container grid-cols-2 items-center space-y-12 lg:grid">
        <div className="px-10 lg:px-0">
          <h1 className="text-center text-2xl font-extrabold text-white uppercase md:text-4xl lg:text-left lg:text-8xl">
            Unbeatable Deals on New & Used Cars
          </h1>
          <h2 className="mt-4 text-center text-base text-white uppercase md:text-3xl lg:text-left lg:text-4xl">
            Discover your dream car today
          </h2>
        </div>
        <div className="mx-auto w-full max-w-md bg-white p-6 shadow-lg sm:rounded-xl">
          <div className="space-y-4">
            <div className="flex w-full flex-col space-y-2 gap-x-4">
              <HomepageTaxonomyFilters
                searchParams={searchParams}
                minMaxValues={minMaxResult}
              />
            </div>
            <SearchButton count={classfiedsCount} />
            {isFilterApplied && (
              <Button asChild variant="outline" className="w-full bg-slate-200">
                <Link href={routes.home}>
                  Clear Filters ({totalFiltersApplied})
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
