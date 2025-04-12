import { ClassifiedFilterSchema } from "@/app/_schemas/classified.schema";
import { AwaitedPageProps } from "@/config/types";
import {
  BodyType,
  ClassifiedStatus,
  Colour,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Prisma,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatPriceArgs {
  price: number | null;
  currency: CurrencyCode | null;
}

export function formatPrice({ price, currency }: FormatPriceArgs) {
  if (!price) return "0";

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    ...(currency && { currency }),
    maximumFractionDigits: 0,
  });

  return formatter.format(price / 100);
}

export function formatNumber(
  num: number | null,
  options?: Intl.NumberFormatOptions,
) {
  if (!num) return "0";
  return new Intl.NumberFormat("en-GB", options).format(num);
}

export function formatOdometerUnit(unit: OdoUnit) {
  return unit === OdoUnit.KILOMETERS ? "km" : "mi";
}

export function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? "Automatic" : "Manual";
}

export function formatFuelType(fuelType: FuelType) {
  switch (fuelType) {
    case FuelType.DIESEL:
      return "Diesel";
    case FuelType.ELECTRIC:
      return "Electric";
    case FuelType.HYBRID:
      return "Hybrid";
    case FuelType.PETROL:
      return "Petrol";
    default:
      return "Unknown";
  }
}

export function formatColour(colour: Colour) {
  // type Colour = "BLACK" | "BLUE" | "BROWN" | "GOLD" | "GREEN" | "GREY" | "ORANGE" | "PINK" | "PURPLE" | "RED" | "SILVER" | "WHITE" | "YELLOW"
  switch (colour) {
    case Colour.BLACK:
      return "Black";
    case Colour.BLUE:
      return "Blue";
    case Colour.BROWN:
      return "Brown";
    case Colour.GOLD:
      return "Gold";
    case Colour.GREEN:
      return "Green";
    case Colour.GREY:
      return "Grey";
    case Colour.ORANGE:
      return "Orange";
    case Colour.PINK:
      return "Pink";
    case Colour.PURPLE:
      return "Purple";
    case Colour.RED:
      return "Red";
    case Colour.SILVER:
      return "Silver";
    case Colour.WHITE:
      return "White";
    case Colour.YELLOW:
      return "Yellow";
    default:
      return "Unknown";
  }
}

export function formatUlezCompliance(ulezCompliant: ULEZCompliance) {
  return ulezCompliant === ULEZCompliance.EXEMPT ? "Exempt" : "Non-Exempt";
}

export function formatBodyType(bodyType: BodyType) {
  switch (bodyType) {
    case BodyType.CONVERTIBLE:
      return "Convertible";
    case BodyType.COUPE:
      return "Coupe";
    case BodyType.HATCHBACK:
      return "Hatchback";
    case BodyType.SUV:
      return "SUV";
    case BodyType.SEDAN:
      return "Sedan";
    case BodyType.WAGON:
      return "Wagon";
    default:
      return "Unknown";
  }
}

// This block of code builds a Prisma filter query for retrieving classified listings based on the provided search parameters. It processes different types of filters (taxonomy, range, numeric, and enum filters) and maps them to a format Prisma understands.
export const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined,
): Prisma.ClassifiedWhereInput => {
  // Returns a Prisma.ClassifiedWhereInput object → This is a Prisma-compatible query object that can be used in prisma.classified.findMany().
  const { data } = ClassifiedFilterSchema.safeParse(searchParams); // make sure the searchParams match the schema.

  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data); // get the keys of the data object.

  const taxonomyFilters = ["make", "model", "modelVariant"];

  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReading: "odoReading",
  };

  const numFilters = ["doors", "seats"];
  const enumFilters = [
    "ulezCompliant",
    "bodyType",
    "fuelType",
    "transmission",
    "colour",
    "currency",
    "odoUnit",
  ];

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined; // get the value of the key from the searchParams.
      if (!value) return acc; // if the value is not present, return the accumulator.
      if (taxonomyFilters.includes(key)) {
        acc[key] = { id: Number(value) }; // if the key is in the taxonomyFilters array, add the id to the accumulator.
      } else if (enumFilters.includes(key)) {
        acc[key] = value;
      } else if (numFilters.includes(key)) {
        acc[key] = Number(value);
      } else if (key in rangeFilters) {
        const field = rangeFilters[key as keyof typeof rangeFilters]; //  Finds the actual field name in the database.
        acc[field] = acc[field] || {};

        if (key.startsWith("min")) {
          acc[field].gte = Number(value);
        } else if (key.startsWith("max")) {
          acc[field].lte = Number(value);
        }
      }

      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as { [key: string]: any },
  );

  return {
    status: ClassifiedStatus.LIVE,
    // conditionally add an object property only when q exists.
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...mapParamsToFields,
  };
};

export const generateTimeOptions = () => {
  const times = [];
  const startHour = 8;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(hour);
    date.setMinutes(0);

    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    times.push({
      label: formattedTime,
      value: formattedTime,
    });
  }
  return times;
};

export const generateDateOptions = () => {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      label: format(date, "dd MMM yyyy"),
      value: format(date, "dd MMM yyyy"),
    });
  }
  return dates;
};

export const formatDate = (date: string, time: string) => {
  const parsedDate = parse(date, "dd MMM yyyy", new Date());
  const parsedTime = parse(time, "hh:mm aa", new Date());

  parsedDate.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

  return parsedDate;
};
