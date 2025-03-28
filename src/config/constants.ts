import { routes } from "./routes";

export const imageSources = {
  // We're gonna create an S3 bucket at some point.
  classifiedPlaceholder:
    "https://car-dealer-website.s3.eu-west-1.amazonaws.com/next-s3-uploads/stock/classified-placeholder.jpeg",
};

export const CLASSIFIEDS_PER_PAGE = 9;

export const navLinks = [
  {
    id: 1,
    href: routes.home,
    label: "Home",
  },
  {
    id: 2,
    href: routes.inventory,
    label: "Inventory",
  },
];
