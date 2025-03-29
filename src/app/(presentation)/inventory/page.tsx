import { PageSchema } from "@/app/_schemas/page.schema";
import { ClassifiedsList } from "@/components/inventory/classifieds-list";
import { DialogFilters } from "@/components/inventory/dialog-filters";
import { InventorySkeleton } from "@/components/inventory/inventory-skeleton";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIEDS_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redit-store";
import { getSourceId } from "@/lib/source-id";
import { buildClassifiedFilterQuery } from "@/lib/utils";
import { ClassifiedStatus } from "@prisma/client";
import { Suspense } from "react";

// gets all the classifieds from the database
const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = PageSchema.parse(searchParams?.page); // parse the page query parameter and ensures it matches the pageSchema.

  const page = validPage ? validPage : 1; // if the page query parameter is not present, set it to 1.
  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE; // calculate the offset for the database query. Databases don’t load all results at once for performance. So we use offset or limit to load a specific portion.
  return prisma.classified.findMany({
    where: buildClassifiedFilterQuery(searchParams), // where clause to filter the records.
    include: {
      images: { take: 1 }, // just take 1 since we dont have a carousel so it's useless to return all of them
    },
    skip: offset, // start at the correct record (pagination)
    take: CLASSIFIEDS_PER_PAGE, // limit the records to the page size.
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = getInventory(searchParams);
  const count = await prisma.classified.count({
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
  const sourceId = await getSourceId();
  //   get the favourites from redis.
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const totalPages = Math.ceil(count / CLASSIFIEDS_PER_PAGE);

  return (
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 p-4">
        {/* NOTE: removed lg:flex-row since we dont have a sidebar pa. */}
        <div className="-mt-1 flex flex-col items-center justify-between space-y-2 pb-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="min-w-fit text-sm font-semibold md:text-base lg:text-xl">
              We have found {count} classifieds...
            </h2>
            <DialogFilters
              minMaxValues={minMaxResult}
              searchParams={searchParams}
              count={count}
            />
          </div>
          <CustomPagination
            baseUrl={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "justify-end hidden lg:block",
              paginationPrevious: "",
              paginationNext: "",
              paginationLink: "border-none active:border",
              paginationLinkActive: "bg-gray-200",
            }}
          />
          {/* Pass the classifieds and favourites to the ClassifiedsList component */}
        </div>
        {/* skeleton loading suspense */}
        <Suspense fallback={<InventorySkeleton />}>
          <ClassifiedsList
            classifieds={classifieds}
            favourites={favourites ? favourites.ids : []}
          />
        </Suspense>
        <CustomPagination
          baseUrl={routes.inventory}
          totalPages={totalPages}
          styles={{
            paginationRoot: "justify-center lg:hidden pt-12",
            paginationPrevious: "",
            paginationNext: "",
            paginationLink: "border-none active:border",
            paginationLinkActive: "bg-gray-200",
          }}
        />
      </div>
    </div>
  );
}
