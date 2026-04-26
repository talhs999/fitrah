"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function submitReview(reviewData: {
  product_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
}) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("reviews")
    .insert(reviewData)
    .select()
    .single();

  if (error) {
    console.error("Error submitting review:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
