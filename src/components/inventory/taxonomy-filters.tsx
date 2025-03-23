"use client";

import { useEffect, useState } from "react";
import { Select } from "../ui/select";
import { endpoints } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { FilterOptions, TaxonomyFiltersProps } from "@/config/types";

export const TaxonomyFilters = (props: TaxonomyFiltersProps) => {
  const { searchParams, handleChange } = props;
  // so makes, models and model variants are all arrays of objects where each object has a label and a value which are both strings.
  const [makes, setMakes] = useState<FilterOptions<string, string>>([]);
  const [models, setModels] = useState<FilterOptions<string, string>>([]);
  const [modelVariants, setModelVariants] = useState<
    FilterOptions<string, string>
  >([]);

  useEffect(() => {
    // Since useEffect doesn’t support async functions directly, we define and call an async function inside it.
    (async function fetchMakesOptions() {
      // create a mutable query params object, loop through the searchParams and set the key and value in the params object.
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(
        searchParams as Record<string, string>,
      )) {
        if (value) params.set(key, value as string);
      }

      const url = new URL(endpoints.taxonomy, window.location.href); // url constructor takes the relative path and the current url.
      url.search = params.toString(); // basically adds the query string to the url.

      // get request which we send to taxonomy endpoint.
      const data = await api.get<{
        makes: FilterOptions<string, string>;
        models: FilterOptions<string, string>;
        modelVariants: FilterOptions<string, string>;
      }>(url.toString());

      setMakes(data.makes);
      setModels(data.models);
      setModelVariants(data.modelVariants);
    })();
  }, [searchParams]);

  return (
    <div>
      <Select
        label="Make"
        name="make"
        value={searchParams?.make as string}
        onChange={handleChange}
        options={makes}
      />
      <Select
        label="Model"
        name="model"
        value={searchParams?.model as string}
        onChange={handleChange}
        options={models}
        disabled={!models.length}
      />
      <Select
        label="Model Variant"
        name="modelVariant"
        value={searchParams?.modelVariant as string}
        onChange={handleChange}
        options={modelVariants}
        disabled={!modelVariants.length}
      />
    </div>
  );
};
