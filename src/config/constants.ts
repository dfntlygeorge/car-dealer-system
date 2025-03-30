import { routes } from "./routes";

export const imageSources = {
  // We're gonna create an S3 bucket at some point.
  classifiedPlaceholder:
    "https://luxurylux.s3.ap-southeast-2.amazonaws.com/uploads/classified-placeholder.jpeg",
  carLineup:
    "https://luxurylux.s3.ap-southeast-2.amazonaws.com/uploads/car-lineup.jpeg",
  featureSection:
    "https://luxurylux.s3.ap-southeast-2.amazonaws.com/uploads/feature-section.jpeg",
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
