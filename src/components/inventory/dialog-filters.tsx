"use client";

import { routes } from "@/config/routes";
import { SidebarProps } from "@/config/types";
import { env } from "@/env";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Settings2 } from "lucide-react";
import { Select } from "../ui/select";
import {
  cn,
  formatBodyType,
  formatColour,
  formatFuelType,
  formatOdometerUnit,
  formatTransmission,
  formatUlezCompliance,
} from "@/lib/utils";
import { BodyType, Colour } from "@prisma/client";
import { SearchInput } from "../shared/search-input";
import { TaxonomyFilters } from "./taxonomy-filters";
import { RangeFilters } from "./range-filters";
import {
  CurrencyCode,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";

interface DialogFiltersProps extends SidebarProps {
  count: number;
}

export const DialogFilters = (props: DialogFiltersProps) => {
  const { minMaxValues, searchParams, count } = props;

  const { _min, _max } = minMaxValues;

  const [isOpen, setIsOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const router = useRouter();

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
    const url = new URL(routes.inventory, env.NEXT_PUBLIC_APP_URL);
    router.replace(url.toString());
    setFilterCount(0);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setQueryStates({ [name]: value || null });

    if (name === "make") {
      setQueryStates({ model: null, modelVariant: null });
    }

    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-w-[425px] overflow-y-auto rounded-xl">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-lg font-semibold">
              <DialogTitle></DialogTitle>
            </div>
            <div className="mt-2" />
          </div>
          <SearchInput
            placeholder="Search classifieds..."
            className="focus:ring-primary w-full rounded-md border py-2 focus:ring-2 focus:outline-hidden"
          />
          {/* Taxonomy filters */}
          <div className="space-y-2">
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
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Search {count > 0 ? `(${count})` : null}
            </Button>
            {filterCount > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                aria-disabled={!filterCount}
                className={cn(
                  "py-1 text-sm",
                  !filterCount
                    ? "disabled pointer-events-none cursor-default opacity-50"
                    : "hover:underline",
                )}
              >
                Clear all {filterCount ? `(${filterCount})` : null}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
