import { imageSources } from "@/config/constants";
import { faker } from "@faker-js/faker";
import type { PrismaClient, Prisma } from "@prisma/client";
import { createPngDataUri } from "unlazy/thumbhash";

export async function seedImages(prisma: PrismaClient) {
  // fetch all classifieds from the db. Returns an array of classified objects.
  const classifieds = await prisma.classified.findMany();

  // map over the classifieds array and return an array of classified ids.
  const classifiedIds = classifieds.map((classified) => classified.id);

  // loop through the classifiedIds array and create an image for each classified.
  for (const classifiedId of classifiedIds) {
    // create an image for the classified.
    const image: Prisma.ImageCreateInput = {
      src: imageSources.classifiedPlaceholder,
      alt: faker.lorem.words(2),
      //   establish a relationship between the image and the classified.
      classified: {
        connect: { id: classifiedId },
      },
      // note next.js doesn't take a blurhash value, so we need to convert the blurhash to base 64 image.
      blurhash: createPngDataUri("jPcJDYCndnZwl4h6Z2eYhWZ/c/VI  "),
    };

    // create the image in the db.
    await prisma.image.create({ data: image });
  }

  console.log(`Seeded ${classifiedIds.length} images.`);
}
