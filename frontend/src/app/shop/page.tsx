import { createClient } from "@/utils/supabase/server";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop the Collection | Fitrah",
  description: "Five premium beard oils, each engineered for a specific purpose.",
};

export default async function ShopPage() {
  const supabase = await createClient();
  
  // Fetch active products and categories from Supabase
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").order("name"),
    supabase.from("categories").select("*").order("name")
  ]);

  return <ShopClient products={productsRes.data || []} categories={categoriesRes.data || []} />;
}
