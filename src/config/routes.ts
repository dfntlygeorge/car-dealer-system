import { MultiStepFormEnum } from "./types";

// this is the routes for the app. Write cleaner code huh.
export const routes = {
  home: "/",
  singleClassified: (slug: string) => `/inventory/${slug}`,
  reserve: (slug: string, step: MultiStepFormEnum) =>
    `/inventory/${slug}/reserve?step=${step}`,
  success: (slug: string) => `/inventory/${slug}/success`,
  favourites: "/favourites",
  inventory: "/inventory",
  notAvailable: (slug: string) => `/inventory/${slug}/not-available`,
};
