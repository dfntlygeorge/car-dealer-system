import { Prisma } from "@prisma/client";

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
