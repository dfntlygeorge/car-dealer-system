import { routes } from "@/config/routes";
import prisma from "@/lib/prisma";
import { ClassifiedStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export const OurBrandsSection = async () => {
  const brands = await prisma.make.findMany({
    where: {
      name: {
        in: [
          "Rolls-Royce",
          "Aston Martin",
          "Porsche",
          "Audi",
          "Jaguar",
          "Land Rover",
          "Mercedes-Benz",
          "Ferrari",
          "Bentley",
          "McLaren",
          "Ford",
          "Volkswage",
          "Maserati",
          "Lexus",
        ],
        mode: "insensitive",
      },
    },
  });

  const count = await prisma.classified.count({
    where: { status: ClassifiedStatus.LIVE },
  });

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-6 lg:px-8">
        <div className="px-6 sm:text-center lg:px-8">
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 uppercase sm:text-4xl">
            Our Brands
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We have {count} vehicle in stock, ready for same-day drive away.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-5">
          {brands.map(({ id, image, name }) => (
            <Link
              key={id}
              href={`${routes.inventory}?make=${id}`}
              className="relative flex h-24 items-center justify-center transition-all duration-100 ease-in-out hover:scale-110"
            >
              <Image
                src={image}
                alt={name}
                className="aspect-1/1 object-contain"
                fill={true}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
