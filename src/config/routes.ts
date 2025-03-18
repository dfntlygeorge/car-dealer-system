import { MultiStepFormEnum } from "./types";

// this is the routes for the app. Write cleaner code huh.
export const routes = {
  home: "/",
  singleClassified: (slug: string) => `/inventory/${slug}`,
  reserve: (slug: string, step: MultiStepFormEnum) =>
    `/inventory/${slug}/reserve?step=${step}`,
  favourites: "/favourites",
  inventory: "/inventory",
};
