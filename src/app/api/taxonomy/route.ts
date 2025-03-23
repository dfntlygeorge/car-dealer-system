import prisma from "@/lib/prisma";
import { Model, ModelVariant } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  // we're using the url constructor to get the search params from the request url.
  const params = new URL(req.url).searchParams; // make sure to fetch the search params outside the try catch block.

  try {
    const makes = await prisma.make.findMany({
      // which fields to fetch from the database.
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    let models: Model[] = [];

    if (params.get("make")) {
      models = await prisma.model.findMany({
        where: {
          make: { id: Number(params.get("make")) }, // gets models where makeId = id of the make in the search params.
        },
      });
    }

    let modelVariants: ModelVariant[] = [];

    if (params.get("model")) {
      modelVariants = await prisma.modelVariant.findMany({
        where: {
          model: { id: Number(params.get("model")) }, // gets model variants where modelId = id of the model in the search params.
        },
      });
    }

    // map the makes, models, model variants and set the label to the name and the value to the id.
    const lvMakes = makes.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));

    const lvModels = models.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));

    const lvModelVariants = modelVariants.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));

    return NextResponse.json(
      // returns a proper HTTP response with the data and status code.
      {
        makes: lvMakes,
        models: lvModels,
        modelVariants: lvModelVariants,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      },
    );
  }
};
