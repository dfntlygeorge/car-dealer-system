"use server";

import prisma from "@/lib/prisma";
import {
  CreateCustomerSchema,
  type CreateCustomerSchemaType,
} from "../_schemas/customer.schema";

export const createCustomerAction = async (props: CreateCustomerSchemaType) => {
  try {
    const { data, success, error } = CreateCustomerSchema.safeParse(props);
    if (!success) {
      console.log({ error });
      return { success: false, message: "Invalid data" };
    }

    if (data.terms !== "true") {
      return { success: false, message: "You must accept the terms" };
    }

    const { date, terms, slug, ...rest } = data;

    await prisma.customer.create({
      data: {
        ...rest,
        bookingDate: date,
        termsAccepted: terms === "true",
        classified: { connect: { slug } },
      },
    });

    return { success: true, message: "Reservation Successful!" };
  } catch (err) {
    console.log({ err });
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Something went wrong" };
  }
};
