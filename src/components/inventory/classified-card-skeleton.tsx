import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const ClassifiedCardSkeleton = () => {
  return (
    <Card className="border-muted border">
      <div className="relative w-full">
        <Skeleton className="aspect-3/2 h-full w-full" />
      </div>
      <CardContent className="h-fit p-4">
        <div className="h-[180px] space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mr-8 h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-around space-x-2">
              <Skeleton className="h-4 w-1/12" />
              <Skeleton className="h-4 w-1/12" />
              <Skeleton className="h-4 w-1/12" />
              <Skeleton className="h-4 w-1/12" />
            </div>
            <div className="flex justify-around space-x-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="relative flex justify-between gap-x-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
};
