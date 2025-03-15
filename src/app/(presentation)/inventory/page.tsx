import { ClassifiedsList } from "@/components/inventory/classifieds-list";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redit-store";
import { getSourceId } from "@/lib/source-id";

// gets all the classifieds from the database
const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  return prisma.classified.findMany({
    include: {
      images: true,
    },
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const sourceId = await getSourceId();
  //   get the favourites from redis.
  const favourites = await redis.get<Favourites>(sourceId ?? "");

  // console.log({ favourites });

  return (
    <>
      {/* Pass the classifieds and favourites to the ClassifiedsList component */}
      <ClassifiedsList
        classifieds={classifieds}
        favourites={favourites ? favourites.ids : []}
      />
    </>
  );
}
