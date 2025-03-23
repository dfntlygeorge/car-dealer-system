import { faker } from "@faker-js/faker";
import {
  BodyType,
  ClassifiedStatus,
  Colour,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Prisma,
  PrismaClient,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import slugify from "slug";

export async function seedClassifieds(prisma: PrismaClient) {
  // fetch all makes from prisma and include only models and model variants.
  const makes = await prisma.make.findMany({
    include: {
      models: {
        include: {
          modelVariants: true,
        },
      },
    },
  });

  // array of promises that interact with the Classified table.
  const classifiedsData: Prisma.ClassifiedCreateManyInput[] = [];

  // loop through 25 times and create a classified for each iteration.
  for (let i = 0; i < 100; i++) {
    // fetch a random make from the makes array/table from the db.
    const make = faker.helpers.arrayElement(makes);

    // if the make has no models, skip to the next iteration.
    if (!make.models.length) continue;

    // fetch a random model from the make models array.
    const model = faker.helpers.arrayElement(make.models);

    // if the model has no model variants, set the variant to null.
    const variant = model.modelVariants.length
      ? faker.helpers.arrayElement(model.modelVariants)
      : null;

    // fetch a random year between 1925 and the current year.
    const year = faker.date
      .between({
        from: new Date(1925, 0, 1),
        to: new Date(),
      })
      .getFullYear();

    // create a title for the classified by joining the year, make, model and variant name. Remove any falsey values.
    const title = [year, make.name, model.name, variant?.name]
      .filter(Boolean)
      .join(" ");

    // create a random vehicle registration mark.
    const vrm = faker.vehicle.vrm();

    // create a base slug for the classified by joining the title and vrm.
    const baseSlug = slugify(`${title}-${vrm}`);

    // push the classified data to the classifiedsData array.
    classifiedsData.push({
      year,
      vrm,
      slug: baseSlug,
      makeId: make.id,
      modelId: model.id,
      ...(variant?.id && { modelVariantId: variant.id }),
      title,
      price: faker.number.int({ min: 400000, max: 10000000 }),
      odoReading: faker.number.int({ min: 0, max: 200000 }),
      doors: faker.number.int({ min: 2, max: 8 }),
      seats: faker.number.int({ min: 2, max: 8 }),
      views: faker.number.int({ min: 0, max: 100000 }),
      description: faker.commerce.productDescription(),
      currency: faker.helpers.arrayElement(Object.values(CurrencyCode)),
      odoUnit: faker.helpers.arrayElement(Object.values(OdoUnit)),
      bodyType: faker.helpers.arrayElement(Object.values(BodyType)),
      transmission: faker.helpers.arrayElement(Object.values(Transmission)),
      fuelType: faker.helpers.arrayElement(Object.values(FuelType)),
      colour: faker.helpers.arrayElement(Object.values(Colour)),
      ulezCompliant: faker.helpers.arrayElement(Object.values(ULEZCompliance)),
      status: faker.helpers.arrayElement(Object.values(ClassifiedStatus)),
    });
  }

  // create the classifieds in the db.
  const result = await prisma.classified.createMany({
    data: classifiedsData,
    skipDuplicates: true, // prevent any duplicate errors from duplicate slug.
  });

  console.log(`Total of ${result.count} classifieds seeded 🌱`);
}
