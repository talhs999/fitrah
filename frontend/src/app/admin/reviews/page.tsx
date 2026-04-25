import ReviewsClient from "./ReviewsClient";
import { createClient } from "@/utils/supabase/server";

export const metadata = { title: "Reviews — Fitrah Admin" };

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  
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
