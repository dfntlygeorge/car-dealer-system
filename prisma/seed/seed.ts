import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy.seed";

const prisma = new PrismaClient();

// this is going to include any other functions that we need to run to seed the database.
async function main() {
  // runs a raw SQL query to truncate the makes table and restart the identity column.
  await prisma.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE`; //

  await seedTaxonomy(prisma);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
