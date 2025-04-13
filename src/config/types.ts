import { Prisma } from "@prisma/client";
import { ChangeEvent } from "react";

// we do this now because searchParams is a promise in Next.js 15 and not a regular object.
type Params = {
  [x: string]: string | string[];
};

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};

// this is the type for the classifieds that we get from the database
export type ClassifiedWithImages = Prisma.ClassifiedGetPayload<{
  include: {
    images: true;
  };
}>;

// this is the type for the multi-step form that we use to create a new classified (TODO)
export enum MultiStepFormEnum {
  WELCOME = 1,
  SELECT_DATE = 2,
  SUBMIT_DETAILS = 3,
}

export interface Favourites {
  ids: number[];
}

export interface TaxonomyFiltersProps extends AwaitedPageProps {
  // extends AwaitedPageProps since we want the searchParams here.
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export type FilterOptions<LType, VType> = Array<{ label: LType; value: VType }>; // basically an array of objects where each object has a label and a value.

export interface SidebarProps extends AwaitedPageProps {
  minMaxValues: Prisma.GetClassifiedAggregateType<{
    _min: {
      year: true;
      price: true;
      odoReading: true;
    };
    _max: {
      year: true;
      price: true;
      odoReading: true;
    };
  }>;
}

export interface MultiStepFormComponentProps extends AwaitedPageProps {
  classified: Prisma.ClassifiedGetPayload<{ include: { make: true } }>;
}

export type PrevState = {
  success: boolean;
  message: string;
};
