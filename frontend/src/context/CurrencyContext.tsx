"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type CurrencyContextType = {
  currency: string;
};

const CurrencyContext = createContext<CurrencyContextType>({ currency: "AUD" });

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

  return (
    <CurrencyContext.Provider value={{ currency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
