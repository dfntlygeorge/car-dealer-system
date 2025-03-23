import type { PrismaClient, Prisma } from "@prisma/client";
import { parse } from "csv";
import fs from "node:fs"; // file system module, built into node.js that lets us read and write files.

type Row = {
  make: string;
  model: string;
  variant?: string | undefined;
  yearStart: number;
  yearEnd: number | (() => number);
};

const BATCH_SIZE = 100;

export async function seedTaxonomy(prisma: PrismaClient) {
  const rows = await new Promise<Row[]>((resolve, reject) => {
    const eachRow: Row[] = [];

    fs.createReadStream("taxonomy.csv") // Read file as a stream.
      .pipe(
        parse({
          columns: true,
        }), // parse csv rows into javascript objects.
      )
      .on("data", (row: { [index: string]: string }) => {
        // row is an object that has dynamic index
        eachRow.push({
          make: row.Make,
          model: row.Model,
          variant: row.Model_Variant || undefined,
          yearStart: Number(row.Year_Start),
          yearEnd: row.Year_End ? Number(row.Year_End) : new Date().getFullYear,
        });
      })
      .on("error", (err) => {
        console.log("Error parsing taxonomy csv", { err });
        reject(err);
      })
      .on("end", () => {
        resolve(eachRow);
      }); // listens for each row and executes a callback function.
  });

  // nested hierarchical structure.
  type MakeModelMap = {
    [make: string]: {
      [model: string]: {
        variants: {
          [variant: string]: {
            yearStart: number;
            yearEnd: number | (() => number);
          };
        };
      };
    };
  };

  const result: MakeModelMap = {};

  for (const row of rows) {
    if (!result[row.make]) {
      result[row.make] = {}; // if the make does not exist, then initialize an empty object.
    }

    if (!result[row.make][row.model]) {
      result[row.make][row.model] = {
        variants: {},
      }; // if the model does not exist, then initialize it.
    }
    // if the variant exists, then add it to the model.
    if (row.variant) {
      result[row.make][row.model].variants[row.variant] = {
        yearStart: row.yearStart,
        yearEnd: row.yearEnd,
      };
    }
  }

  // convert the result object (MakeModelMap) to an array of key/value pairs. Use map and pass [name] which basically desctructures the first element of the array. Then, find a record in make table where name is equal to the name of the make. Use upsert to either create it if it doesn't exist or update it if it does. Returns an array of promises.
  const makePromises = Object.entries(result).map(([name]) => {
    return prisma.make.upsert({
      where: {
        name,
      },
      update: {
        name,
        image: `https://vl.imgix.net/img/${name
          .replace(/\s+/g, "-")
          .toLowerCase()}-logo.png?auto=format,compress`,
      },
      create: {
        name,
        image: `https://vl.imgix.net/img/${name
          .replace(/\s+/g, "-")
          .toLowerCase()}-logo.png?auto=format,compress`,
      },
    });
  });

  // wait for all database operations to complete.
  const makes = await Promise.all(makePromises);

  console.log(`Seeded db with ${makes.length} makes 🌱`);

  // array of promises that interact with the Model table.
  const modelPromises: Prisma.Prisma__ModelClient<unknown, unknown>[] = [];

  // outer loop: iterate over the makes.
  // inner loop: iterate over the models of the make (result[make.name]). We push an upsert query to the modelPromises array. Wherein, we find a record in the model table where name is equal to the name of the model and makeId is equal to the id of the make. Use upsert to update it if it exists or create it if it doesn't. In the create function, we also establish a relation to correct make.
  for (const make of makes) {
    for (const model in result[make.name]) {
      modelPromises.push(
        prisma.model.upsert({
          where: {
            name_makeId: {
              name: model,
              makeId: make.id,
            },
          },
          update: {
            name: model,
          },
          create: {
            name: model,
            make: {
              connect: {
                id: make.id,
              },
            },
          },
        }),
      );
    }
  }

  // Returns a promise that resolves when all the promises in the batch are resolved. Accepts items which is an array of promises, batchSize which is the number of items to process at a time, and insertFunction which is a function that accepts a batch of items and returns a promise.
  async function insertInBatches<TUpsertArgs>(
    items: TUpsertArgs[],
    batchSize: number,
    insertFunction: (batch: TUpsertArgs[]) => void,
  ) {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await insertFunction(batch);
    }
  }

  // wait for all database operations to complete.
  await insertInBatches<Prisma.Prisma__ModelClient<unknown, unknown>>(
    modelPromises,
    BATCH_SIZE,
    async (batch) => {
      const models = await Promise.all(batch);
      console.log(`Seeded db with ${models.length} models 🌱`);
    },
  );

  // array of promises that interact with the ModelVariant table.
  const variantPromises: Prisma.Prisma__ModelVariantClient<unknown, unknown>[] =
    [];

  // super outer loop: iterate over the makes. Get all the models of the make.
  for (const make of makes) {
    const models = await prisma.model.findMany({
      where: {
        makeId: make.id,
      },
    });

    // outer loop: iterate over the models of the make.
    for (const model of models) {
      // inner loop: iterate over the variants of the model. Specifically, we get the key/value pairs of the variants object. Desctructure the key-variant and value-year_range.
      for (const [variant, year_range] of Object.entries(
        result[make.name][model.name].variants,
      )) {
        // push an upsert query to the variantPromises array.
        variantPromises.push(
          prisma.modelVariant.upsert({
            // find a record in the modelVariant table where name is equal to the name of the variant and modelId is equal to the id of the model.
            where: {
              name_modelId: {
                name: variant,
                modelId: model.id,
              },
            },
            update: {
              name: variant,
            },
            create: {
              name: variant,
              yearStart: year_range.yearStart,
              yearEnd:
                typeof year_range.yearEnd === "number"
                  ? year_range.yearEnd
                  : new Date().getFullYear(),
              model: { connect: { id: model.id } },
            },
          }),
        );
      }
    }
  }

  // wait for all database operations to complete.
  await insertInBatches<Prisma.Prisma__ModelVariantClient<unknown, unknown>>(
    variantPromises,
    BATCH_SIZE,
    async (batch) => {
      const variants = await Promise.all(batch);
      console.log(`Seeded db with ${variants.length} variants 🌱`);
    },
  );
}
