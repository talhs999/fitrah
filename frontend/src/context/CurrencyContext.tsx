"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type CurrencyContextType = {
  currency: string;
  currencySymbol: string;
};

const CurrencyContext = createContext<CurrencyContextType>({ currency: "AUD", currencySymbol: "$" });

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState("AUD");

  useEffect(() => {
    const loadCurrency = async () => {
      const supabase = createClient();
      // Use single() to fetch the first row from payment_settings
      const { data, error } = await supabase.from("payment_settings").select("currency").single();
      if (data && data.currency) {
        setCurrency(data.currency);
      }
    };
    loadCurrency();
  }, []);

  let currencySymbol = "$";
  if (currency === "PKR") currencySymbol = "Rs ";
  else if (currency === "GBP") currencySymbol = "£";
  else if (currency === "EUR") currencySymbol = "€";

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
