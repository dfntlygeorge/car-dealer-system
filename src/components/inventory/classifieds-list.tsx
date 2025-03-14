import { ClassifiedWithImages } from "@/config/types";
import { ClassifiedCard } from "./classified-card";

interface ClassifiedsListProps {
  classifieds: ClassifiedWithImages[];
}

export const ClassifiedsList = (props: ClassifiedsListProps) => {
  const { classifieds } = props;
  return (
    <div className="grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-4 grid">
      {/* Map over the classifieds and return a ClassifiedCard for each one */}
      {classifieds.map((classified) => {
        return <ClassifiedCard key={classified.id} classified={classified} />;
      })}
    </div>
  );
};
