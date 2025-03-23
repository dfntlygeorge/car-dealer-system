"use client";

import { routes } from "@/config/routes";
import { SidebarProps } from "@/config/types";
import { env } from "@/env";
import {
  cn,
  formatBodyType,
  formatColour,
  formatFuelType,
  formatOdometerUnit,
  formatTransmission,
  formatUlezCompliance,
} from "@/lib/utils";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchInput } from "../shared/search-input";
import { TaxonomyFilters } from "./taxonomy-filters";
import { RangeFilters } from "./range-filters";
import {
  BodyType,
  Colour,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { Select } from "../ui/select";

export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
  const router = useRouter();
  const [filterCount, setFilterCount] = useState(0);
  const { _min, _max } = minMaxValues;
  //Uses nuqs's useQueryStates to sync filter states with the URL.
  const [queryStates, setQueryStates] = useQueryStates(
    {
      make: parseAsString.withDefault(""),
      model: parseAsString.withDefault(""),
      modelVariant: parseAsString.withDefault(""),
      minYear: parseAsString.withDefault(""),
      maxYear: parseAsString.withDefault(""),
      minPrice: parseAsString.withDefault(""),
      maxPrice: parseAsString.withDefault(""),
      minReading: parseAsString.withDefault(""),
      maxReading: parseAsString.withDefault(""),
      currency: parseAsString.withDefault(""),
      odoUnit: parseAsString.withDefault(""),
      transmission: parseAsString.withDefault(""),
      fuelType: parseAsString.withDefault(""),
      bodyType: parseAsString.withDefault(""),
      colour: parseAsString.withDefault(""),
      doors: parseAsString.withDefault(""),
      seats: parseAsString.withDefault(""),
      ulezCompliant: parseAsString.withDefault(""),
    },
    {
      shallow: false, // refreshes the data every time the query state changes
    },
  );

  useEffect(() => {
    const filterCount = Object.entries(
      searchParams as Record<string, string>,
    ).filter(([key, value]) => key !== "page" && value).length; // ignore page and empty values
    setFilterCount(filterCount);
  }, [searchParams]);

  const clearFilters = () => {
    const url = new URL(routes.inventory, env.NEXT_PUBLIC_APP_URL); // construct the absolute URL for the inventory page
    window.location.replace(url.toString()); // redirects the user to the new URL.
    setFilterCount(0);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setQueryStates({ [name]: value || null }); // Updates URL to ?make=1

    if (name === "make") {
      setQueryStates({ model: null, modelVariant: null }); // Reset dependent filters
    }

    router.refresh(); // Refreshes the page to reflect the new filters.
  };

  return (
    <div className="border-muted hidden w-[21.25rem] border-r py-4 lg:block">
      <div>
        <div className="flex justify-between px-4 text-lg font-semibold">
          <span>Filters</span>
          <button
            type="button"
            onClick={clearFilters}
            className={cn(
              "py-1 text-sm text-gray-500",
              !filterCount
                ? "disabled pointer-events-none opacity-50"
                : "cursor-pointer hover:underline",
            )}
            aria-disabled={!filterCount}
          >
            Clear all {filterCount ? `(${filterCount})` : null}
          </button>
        </div>
        <div className="mt-2" />
      </div>
      <div className="p-4">
        <SearchInput
          placeholder="Search classifieds..."
          className="focus:ring-primary w-full rounded-md border py-2 focus:ring-2 focus:outline-hidden"
        />
      </div>
      <div className="space-y-2 p-4">
        <TaxonomyFilters
          searchParams={searchParams}
          handleChange={handleChange}
        />
        <RangeFilters
          label="Year"
          minName="minYear"
          maxName="maxYear"
          defaultMin={_min.year || 1925}
          defaultMax={_max.year || new Date().getFullYear()}
          handleChange={handleChange}
          searchParams={searchParams}
        />
        <RangeFilters
          label="Price"
          minName="minPrice"
          maxName="maxPrice"
          defaultMin={_min.price || 0}
          defaultMax={_max.price || 21474836}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={1000000}
          thousandSeparator
          currency={{
            currencyCode: "GBP",
          }}
        />
        <RangeFilters
          label="Odometer Reading"
          minName="minReading"
          maxName="maxReading"
          defaultMin={_min.odoReading || 0}
          defaultMax={_max.odoReading || 1000000}
          handleChange={handleChange}
          searchParams={searchParams}
          thousandSeparator
          increment={5000}
        />
        <Select
          label="Currency"
          name="currency"
          value={queryStates.currency || ""}
          onChange={handleChange}
          options={Object.values(CurrencyCode).map((value) => ({
            label: value,
            value,
          }))}
        />
        <Select
          label="Odometer Unit"
          name="odoUnit"
          value={queryStates.odoUnit || ""}
          onChange={handleChange}
          options={Object.values(OdoUnit).map((value) => ({
            label: formatOdometerUnit(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Transmission"
          name="transmission"
          value={queryStates.transmission || ""}
          onChange={handleChange}
          options={Object.values(Transmission).map((value) => ({
            label: formatTransmission(value),
            value,
          }))}
        />
        <Select
          label="Fuel Type"
          name="fuelType"
          value={queryStates.fuelType || ""}
          onChange={handleChange}
          options={Object.values(FuelType).map((value) => ({
            label: formatFuelType(value),
            value,
          }))}
        />
        <Select
          label="Body Type"
          name="bodyType"
          value={queryStates.bodyType || ""}
          onChange={handleChange}
          options={Object.values(BodyType).map((value) => ({
            label: formatBodyType(value), // formatBodyType()
            value,
          }))}
        />
        <Select
          label="Colour"
          name="colour"
          value={queryStates.colour || ""}
          onChange={handleChange}
          options={Object.values(Colour).map((value) => ({
            label: formatColour(value),
            value,
          }))}
        />
        <Select
          label="ULEZ Compliance"
          name="ulezCompliant"
          value={queryStates.ulezCompliant || ""}
          onChange={handleChange}
          options={Object.values(ULEZCompliance).map((value) => ({
            label: formatUlezCompliance(value), // formatULEZCompliance()
            value,
          }))}
        />
        <Select
          label="Doors"
          name="doors"
          value={queryStates.doors || ""}
          onChange={handleChange}
          options={Array.from({ length: 6 }).map((_, index) => ({
            label: Number(index + 1).toString(),
            value: Number(index + 1).toString(),
          }))}
        />
        <Select
          label="Seats"
          name="seats"
          value={queryStates.seats || ""}
          onChange={handleChange}
          options={Array.from({ length: 8 }).map((_, index) => ({
            label: Number(index + 1).toString(),
            value: Number(index + 1).toString(),
          }))}
        />
      </div>
    </div>
  );
};
