import { PrismaClient } from "@prisma/client";
import { seedImages } from "./images.seed";
import { seedClassifieds } from "./classified.seed";
import { seedTaxonomy } from "./taxonomy.seed";
import { seedAdmin } from "./admin.seed";

const prisma = new PrismaClient();

// this is going to include any other functions that we need to run to seed the database.
async function main() {
  // runs a raw SQL query to truncate the makes table and restart the identity column.
  // await prisma.$executeRaw`TRUNCATE TABLE "classifieds" RESTART IDENTITY CASCADE`; //
  // await seedTaxonomy(prisma);
  // await seedClassifieds(prisma);
  // await seedImages(prisma);

  await seedAdmin(prisma);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
