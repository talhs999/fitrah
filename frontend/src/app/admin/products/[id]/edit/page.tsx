import { createClient } from "@/utils/supabase/server";
import ProductForm from "../../ProductForm";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Product — Fitrah Admin" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const [productRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name")
  ]);

  if (!productRes.data) {
    console.error("Product fetch error:", productRes.error);
    return notFound();
  }

  return <ProductForm product={productRes.data} categories={categoriesRes.data || []} />;
}
