import { createClient } from "@/utils/supabase/server";
import OrdersClient from "./OrdersClient";

export const metadata = { title: "Manage Orders — Fitrah Admin" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  
  // Fetch orders with their order_items and the related product details for each item
  const { data: rawOrders } = await supabase
    .from("orders")
    .select(`
      *, 
      order_items(
        *,
        product:products(*)
      )
    `)
    .order("created_at", { ascending: false });

  const orders = rawOrders || [];

  return <OrdersClient orders={orders} />;
}
