import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("name, tagline").eq("id", id).single();
  
  if (!product) return { title: "Product Not Found — Fitrah" };
  return { title: `${product.name} — ${product.tagline} | Fitrah` };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const [productRes, relatedRes, reviewsRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("products").select("*").neq("id", id).limit(3),
    supabase.from("reviews").select("*").eq("product_id", id).order("created_at", { ascending: false })
  ]);

  const product = productRes.data;
  if (!product) return notFound();

  return <ProductClient product={product} related={relatedRes.data || []} initialReviews={reviewsRes.data || []} />;
}
