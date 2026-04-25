import { createClient } from "@/utils/supabase/server";
import ProductForm from "../ProductForm";

export const metadata = { title: "Add Product — Fitrah Admin" };

export default async function AddProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return <ProductForm categories={categories || []} />;
}
