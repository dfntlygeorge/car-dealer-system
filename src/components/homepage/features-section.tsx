import { imageSources } from "@/config/constants";
import { imgixLoader } from "@/lib/imgix-loader";

export const FeaturesSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-8xl mx-auto sm:text-center">
          <h2 className="text-base leading-7 font-semibold md:text-2xl">
            Weve got what you need
          </h2>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 uppercase sm:text-8xl">
            No Car? No problem
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our exclusive collection offers unmatched luxury and speed for the ultimate driving experience
          </p>
        </div>
      </div>
      <div>
        <div
          className="mx-auto h-[300px] max-w-7xl bg-cover bg-bottom bg-no-repeat shadow-2xl xl:rounded-t-xl"
          style={{
            backgroundImage: `url(${imgixLoader({ src: imageSources.featureSection, width: 1200, quality: 100 })})`,
          }}
        />
        <div aria-hidden="true" className="relative hidden xl:block">
          <div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-white to-transparent pt-[3%]" />
        </div>
      </div>
    </div>
  );
};
