import { FilterOptions, TaxonomyFiltersProps } from "@/config/types";
import { CurrencyCode } from "@prisma/client";
import { RangeSelect } from "../ui/range-select";
import { useEffect, useState } from "react";
import { formatNumber, formatPrice } from "@/lib/utils";

interface RangeFiltersProps extends TaxonomyFiltersProps {
  label: string;
  minName: string;
  maxName: string;
  defaultMin: number;
  defaultMax: number;
  increment?: number;
  thousandSeparator?: boolean;
  currency?: {
    currencyCode: CurrencyCode;
  };
}

export const RangeFilters = (props: RangeFiltersProps) => {
  const {
    label,
    minName,
    maxName,
    defaultMin,
    defaultMax,
    increment,
    thousandSeparator,
    currency,
    handleChange,
    searchParams,
  } = props;

  // generates an array of options for the min and max dropdowns.
  const getInitialState = () => {
    const state: FilterOptions<string, number> = [];
    let iterator = defaultMin - (increment ?? 1); //This ensures that the first iterator += increment inside the loop starts at defaultMin

    do {
      if (increment) {
        iterator += increment;
      } else {
        iterator++;
      }
      // depending on the formatting settings, it adds an option to state
      if (currency) {
        state.push({
          label: formatPrice({
            price: iterator,
            currency: currency.currencyCode,
          }),
          value: iterator,
        });
      } else if (thousandSeparator) {
        state.push({ label: formatNumber(iterator), value: iterator });
      } else {
        state.push({
          value: iterator,
          label: iterator.toString(),
        });
      }
    } while (iterator < defaultMax); // So it fills the state array with all possible values from defaultMin to defaultMax.

    return state;
  };

  const initialState = getInitialState();

  const [minOptions, setMinOptions] =
    useState<FilterOptions<string, number>>(initialState);
  const [maxOptions, setMaxOptions] = useState<FilterOptions<string, number>>(
    initialState.toReversed(),
  );

  // adjusts options based on the user selection.
  useEffect(() => {
    // if the minName is in the searchParams, then filter the maxOptions to only include values greater than the minName.
    if (searchParams?.[minName]) {
      setMaxOptions(
        initialState.filter(
          ({ value }) => value > Number(searchParams?.[minName]),
        ),
      );
    }
    // if the maxName is in the searchParams, then filter the minOptions to only include values less than the maxName.
    if (searchParams?.[maxName]) {
      setMinOptions(
        initialState.filter(
          ({ value }) => value < Number(searchParams?.[maxName]),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.[minName], searchParams?.[maxName]]);

  return (
    <RangeSelect
      label={label}
      minSelect={{
        name: minName,
        value: Number(searchParams?.[minName] || ""),
        onChange: handleChange,
        options: minOptions,
      }}
      maxSelect={{
        name: maxName,
        value: Number(searchParams?.[maxName] || ""),
        onChange: handleChange,
        options: maxOptions,
      }}
    />
  );
};
