"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { endpoints } from "@/config/enpoints";

interface FavouriteButtonProps {
  setIsFavourite: (isFavourite: boolean) => void;
  isFavourite: boolean;
  id: number;
}
export const FavouriteButton = (props: FavouriteButtonProps) => {
  const { setIsFavourite, isFavourite, id } = props;

  const router = useRouter();
  // make the api request with this handler
  const handleFavourite = async () => {
    // why did we have to destructure the ids? so kase object is returned from the api with ids as key or property.
    const { ids } = await api.post<{ ids: number[] }>(endpoints.favourites, {
      json: { id }, // send the id to the api endpoint
    });

    // if the ids that are returned from the api enpoint then we set the isFavourite to true
    if (ids.includes(id)) setIsFavourite(true);
    else setIsFavourite(false);
    setTimeout(() => router.refresh(), 250);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-2.5 left-3.5 rounded-full z-10 group !h-8 !w-8 lg:!h-9 lg:!w-9 xl:!h-10 xl:!w-10 hover:bg-white/90 transition-colors duration-200",
        isFavourite ? "bg-white shadow-sm" : "bg-white/70 backdrop-blur-sm"
      )}
      onClick={handleFavourite}
    >
      <HeartIcon
        className={cn(
          "w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-6 xl:h-6",
          "transition-colors duration-200 ease-in-out",
          isFavourite
            ? "text-pink-500 fill-pink-500"
            : "text-white group-hover:text-pink-500 group-hover:fill-pink-500"
        )}
      />
    </Button>
  );
};
