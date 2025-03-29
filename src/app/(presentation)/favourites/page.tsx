import { PageSchema } from "@/app/_schemas/page.schema";
import { ClassifiedCard } from "@/components/inventory/classified-card";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIEDS_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { Favourites, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redit-store";
import { getSourceId } from "@/lib/source-id";

export default async function FavouritesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const validPage = PageSchema.parse(searchParams?.page); // parse the page query parameter and ensures it matches the pageSchema.
  const sourceId = await getSourceId();
  //   get the favourites from redis.
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const page = validPage ? validPage : 1; // if the page query parameter is not present, set it to 1.
  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE; // calculate the offset for the database query. Databases don’t load all results at once for performance. So we use offset or limit to load a specific portion.
  const classifieds = await prisma.classified.findMany({
    where: { id: { in: favourites ? favourites.ids : [] } }, // where clause to filter the records.
    include: {
      images: { take: 1 }, // just take 1 since we dont have a carousel so it's useless to return all of them
    },
    skip: offset, // start at the correct record (pagination)
    take: CLASSIFIEDS_PER_PAGE, // limit the records to the page size.
  });

  const count = await prisma.classified.count({
    where: { id: { in: favourites ? favourites.ids : [] } }, // where the id field matches any value in the provided array.
  });

  const totalPages = Math.ceil(count / CLASSIFIEDS_PER_PAGE);

  return (
    <div className="container mx-auto min-h-[80dvh] px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Favourite Classifieds</h1>
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-lg text-gray-600">
            You have not saved any classifieds yet.
          </p>
          <p className="text-gray-500">
            Browse our inventory and click the heart icon to add favourites.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {classifieds.map((classified) => (
              <ClassifiedCard
                key={classified.id}
                classified={classified}
                favourites={favourites ? favourites.ids : []}
              />
            ))}
          </div>
          <div className="mt-8 flex">
            <CustomPagination
              baseUrl={routes.favourites}
              totalPages={totalPages}
              styles={{
                paginationRoot: "justify-center",
                paginationPrevious: "",
                paginationNext: "",
                paginationLinkActive: "",
                paginationLink: "border-none active-border",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
