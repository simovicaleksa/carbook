"use client";

import { useEffect, useState } from "react";

import { useUrl } from "~/hooks/use-url";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function CurrencySelectAction(props: { currencies: string[] }) {
  const { setParams } = useUrl();

  const [currency, setCurrency] = useState<string>(props.currencies[0] ?? "");

  useEffect(() => {
    if (!currency.length) return;

    setParams({
      currency: currency,
    });
  }, [setParams, currency]);

  if (props.currencies.length <= 0) return null;

  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v)}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.currencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
