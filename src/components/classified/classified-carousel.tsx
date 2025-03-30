"use client";

import { Image as PrismaImage } from "@prisma/client";
import FsLightbox from "fslightbox-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/virtual";
import { EffectFade, Navigation, Virtual, Thumbs } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { SwiperButtons } from "../shared/swiper-buttons";
import { CarouselSkeleton } from "./carousel-skeleton";
import { ImgixImage } from "../ui/imgix-image";
import { imgixLoader } from "@/lib/imgix-loader";

interface ClassifiedCarouselProps {
  images: PrismaImage[];
}

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => <CarouselSkeleton />,
});

const SwiperThumb = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  {
    ssr: false,
    loading: () => null,
  },
);

export const ClassifiedCarousel = ({ images }: ClassifiedCarouselProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    sourceIndex: 0,
  });

  const setSwiper = (swiper: SwiperType) => {
    setThumbsSwiper(swiper);
  };

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  }, []);

  const handleImageClick = useCallback(() => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      sourceIndex: activeIndex,
    });
  }, [lightboxController.toggler, activeIndex]);

  const sources = images.map((image) =>
    imgixLoader({ src: image.src, width: 2400, quality: 100 }),
  );
  return (
    <>
      <FsLightbox
        toggler={lightboxController.toggler}
        sourceIndex={lightboxController.sourceIndex}
        sources={sources}
        type="image"
      />
      <div className="relative">
        <Swiper
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          effect="fade"
          spaceBetween={10}
          fadeEffect={{ crossFade: true }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[EffectFade, Navigation, Virtual, Thumbs]}
          virtual={{
            addSlidesAfter: 8,
            enabled: true,
          }}
          onSlideChange={handleSlideChange}
          className="aspect-3/2"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} virtualIndex={index}>
              <Image
                placeholder="blur"
                blurDataURL={image.blurhash}
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                quality={45}
                className="aspect-3/2 cursor-pointer rounded-md object-cover"
                onClick={handleImageClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperButtons
          prevClassName="left-4 bg-white"
          nextClassName="right-4 bg-white"
        />{" "}
      </div>
      <SwiperThumb
        onSwiper={setSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs, EffectFade]}
      >
        {images.map((image) => (
          <SwiperSlide
            key={image.id}
            className="relative mt-2 h-fit w-full cursor-grab"
          >
            <ImgixImage
              className="aspect-3/2 rounded-md object-cover"
              width={150}
              height={100}
              quality={1}
              src={image.src}
              alt={image.alt}
              placeholder="blur"
              blurDataURL={image.blurhash}
            />
          </SwiperSlide>
        ))}
      </SwiperThumb>
    </>
  );
};
