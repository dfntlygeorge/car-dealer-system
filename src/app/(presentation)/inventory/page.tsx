import { ClassifiedsList } from "@/components/inventory/classifieds-list";
import { DialogFilters } from "@/components/inventory/dialog-filters";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIEDS_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redit-store";
import { getSourceId } from "@/lib/source-id";
import { ClassifiedStatus, Prisma } from "@prisma/client";
import { z } from "zod";

const PageSchema = z
  .string() // expected type of the page query parameter.
  .transform((val) => Math.max(1, Number(val))) // convert the value to a number and ensure it's at least 1.
  .optional(); // make it optional since it's not required.

const ClassifiedFilterSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minReading: z.string().optional(),
  maxReading: z.string().optional(),
  currency: z.string().optional(),
  odoUnit: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  colour: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  ulezCompliant: z.string().optional(),
});

// This block of code builds a Prisma filter query for retrieving classified listings based on the provided search parameters. It processes different types of filters (taxonomy, range, numeric, and enum filters) and maps them to a format Prisma understands.
const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined,
): Prisma.ClassifiedWhereInput => {
  // Returns a Prisma.ClassifiedWhereInput object → This is a Prisma-compatible query object that can be used in prisma.classified.findMany().
  const { data } = ClassifiedFilterSchema.safeParse(searchParams); // make sure the searchParams match the schema.

  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data); // get the keys of the data object.

  const taxonomyFilters = ["make", "model", "modelVariant"];

  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReading: "odoReading",
  };

  const numFilters = ["doors", "seats"];
  const enumFilters = [
    "ulezCompliant",
    "bodyType",
    "fuelType",
    "transmission",
    "colour",
    "currency",
    "odoUnit",
  ];

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined; // get the value of the key from the searchParams.
      if (!value) return acc; // if the value is not present, return the accumulator.
      if (taxonomyFilters.includes(key)) {
        acc[key] = { id: Number(value) }; // if the key is in the taxonomyFilters array, add the id to the accumulator.
      } else if (enumFilters.includes(key)) {
        acc[key] = value;
      } else if (numFilters.includes(key)) {
        acc[key] = Number(value);
      } else if (key in rangeFilters) {
        const field = rangeFilters[key as keyof typeof rangeFilters]; //  Finds the actual field name in the database.
        acc[field] = acc[field] || {};

        if (key.startsWith("min")) {
          acc[field].gte = Number(value);
        } else if (key.startsWith("max")) {
          acc[field].lte = Number(value);
        }
      }

      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as { [key: string]: any },
  );

  return {
    status: ClassifiedStatus.LIVE,
    // conditionally add an object property only when q exists.
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...mapParamsToFields,
  };
};
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
  const classifieds = await getInventory(searchParams);
  const count = await prisma.classified.count({
    where: buildClassifiedFilterQuery(searchParams),
  });

  console.log(count);

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
        <ClassifiedsList
          classifieds={classifieds}
          favourites={favourites ? favourites.ids : []}
        />
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
