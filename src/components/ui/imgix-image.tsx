"use client";

import { imgixLoader } from "@/lib/imgix-loader";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type ImgixImageProps = Omit<ImageProps, "priority" | "loading">;

export const ImgixImage = (props: ImgixImageProps) => {
  const [error, setError] = useState(false);

  // eslint-disable-next-line jsx-a11y/alt-text
  if (error) return <Image fetchPriority="high" {...props} />;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      fetchPriority="high"
      loader={(imgProps) => imgixLoader(imgProps)}
      onError={setError(true)}
      {...props}
    />
  );
};
