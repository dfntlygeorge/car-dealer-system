import { ClassifiedsList } from "@/components/inventory/classifieds-list";
import { AwaitedPageProps, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";

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
  const count = await prisma.classified.count();

  console.log({ count });

  return (
    <>
      {/* Pass the classifieds to the ClassifiedsList component */}
      <ClassifiedsList classifieds={classifieds} />
    </>
  );
}
