import prisma from "@/lib/prisma";
import { LatestArrivalsCarousel } from "./latest-arrivals-carousel";
import { ClassifiedStatus } from "@prisma/client";
import { getSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redit-store";
import { Favourites } from "@/config/types";

export const LatestArrivals = async () => {
  const classifieds = await prisma.classified.findMany({
    where: { status: ClassifiedStatus.LIVE },
    take: 6,
    include: { images: true },
  });

  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId || "");
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-[80vw]">
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 uppercase sm:text-4xl">
          Latest Arrivals
        </h2>
        <LatestArrivalsCarousel
          classifieds={classifieds}
          favourites={favourites ? favourites.ids : []}
        />
      </div>
    </section>
  );
};
