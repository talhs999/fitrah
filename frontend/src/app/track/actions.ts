"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function trackOrder(trackingId: string) {
  if (!trackingId || trackingId.trim().length < 8) {
    return { success: false, error: "Please enter a valid Tracking ID." };
  }

  const shortId = trackingId.trim().toUpperCase();

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // We fetch the latest 1000 orders since we only have the short ID
  // In a massive app, we'd add a separate tracking_id column
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, created_at, total_amount, customer_name, shipping_address")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error || !orders) {
    return { success: false, error: "Failed to fetch orders." };
  }

  const order = orders.find(o => o.id.toUpperCase().startsWith(shortId));

  if (!order) {
    return { success: false, error: "Order not found. Please check your Tracking ID." };
  }

  // Also fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select(`
      quantity,
      price_at_time,
      products ( name )
    `)
    .eq("order_id", order.id);

  return { 
    success: true, 
    order: {
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }),
      total: order.total_amount,
      customerName: order.customer_name,
      shippingAddress: order.shipping_address,
      items: items?.map(item => ({
        name: (item.products as any)?.name || "Product",
        qty: item.quantity,
        price: item.price_at_time
      })) || []
    } 
  };
}
