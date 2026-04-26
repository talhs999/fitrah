import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import ReviewsClient from "./ReviewsClient";

export const metadata = { title: "Reviews — Fitrah Admin" };

export default async function AdminReviewsPage() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Fetch reviews and join with products
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      products (name, image)
    `)
    .order("created_at", { ascending: false });

  return <ReviewsClient initialReviews={reviews || []} />;
}
