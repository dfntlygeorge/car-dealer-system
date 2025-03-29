"use client";

import { ClassifiedWithImages } from "@/config/types";
import { ClassifiedCard } from "./classified-card";
import { use } from "react";

interface ClassifiedsListProps {
  classifieds: Promise<ClassifiedWithImages[]>;
  favourites: number[];
}

export const ClassifiedsList = (props: ClassifiedsListProps) => {
  const { classifieds, favourites } = props;
  const inventory = use(classifieds); // use is a React API that lets you read the value of a resource like a Promise or context.
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {/* Map over the classifieds and return a ClassifiedCard for each one */}
      {inventory.map((classified) => {
        return (
          <ClassifiedCard
            key={classified.id}
            classified={classified}
            favourites={favourites}
          />
        );
      })}
    </div>
  );
};
