import { ClassifiedsList } from "@/components/inventory/classifieds-list";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIEDS_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redit-store";
import { getSourceId } from "@/lib/source-id";
import { z } from "zod";

const PageSchema = z
  .string() // expected type of the page query parameter.
  .transform((val) => Math.max(1, Number(val))) // convert the value to a number and ensure it's at least 1.
  .optional(); // make it optional since it's not required.
// gets all the classifieds from the database
const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = PageSchema.parse(searchParams?.page); // parse the page query parameter and ensures it matches the pageSchema.

  const page = validPage ? validPage : 1; // if the page query parameter is not present, set it to 1.
  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE; // calculate the offset for the database query. Databases don’t load all results at once for performance. So we use offset or limit to load a specific portion.
  return prisma.classified.findMany({
    where: {}, // no specific filters, fetch all records.
    include: {
      images: { take: 1 }, // just take 1 since we dont have a carousel so it's useless to return all of them
    },
    skip: offset, // start at the correct record (pagination)
    take: CLASSIFIEDS_PER_PAGE, // limit the records to the page size.
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const sourceId = await getSourceId();
  const count = await prisma.classified.count({
    where: {},
  });
  //   get the favourites from redis.
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const totalPages = Math.ceil(count / CLASSIFIEDS_PER_PAGE);

  return (
    <div className="flex">
      <Sidebar minMaxValues={null} searchParams={searchParams} />
      <div className="flex-1 p-4 ">
        {/* NOTE: removed lg:flex-row since we dont have a sidebar pa. */}
        <div className="flex flex-col pb-4 space-y-2 items-center justify-between -mt-1">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit">
              We have found {count} classifieds...
            </h2>
            {/* <DialogFilter/> for mobile */}
          </div>
          <CustomPagination
            baseUrl={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "justify-end",
              paginationPrevious: "",
              paginationNext: "",
              paginationLink: "border-none active:border",
              paginationLinkActive: "bg-gray-200",
            }}
          />
          {/* Pass the classifieds and favourites to the ClassifiedsList component */}
          <ClassifiedsList
            classifieds={classifieds}
            favourites={favourites ? favourites.ids : []}
          />
        </div>
      </div>
    </div>
  );
}
