"use server";

import { createClient } from "@/utils/supabase/server";

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  city?: string;
  country?: string;
  postal_code?: string;
  total_amount: number;
  items: { id: string; qty: number; price: number }[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Try to insert with all possible columns based on schema
  const orderPayload: any = {
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    shipping_address: orderData.shipping_address,
    total_amount: orderData.total_amount,
    status: "Processing"
  };

  // Add these if they exist in schema-complete.sql to prevent NOT NULL errors
  orderPayload.customer_phone = orderData.customer_phone || "0000000000";
  orderPayload.city = orderData.city || "Unknown";
  orderPayload.country = orderData.country || "Australia";
  orderPayload.postal_code = orderData.postal_code || "0000";

  // Optional user_id (ignore if table doesn't have it)
  if (user) {
    orderPayload.user_id = user.id;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message || "Failed to create order" };
  }

  // Insert Order Items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.qty,
    price_at_time: item.price
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return { success: false, error: itemsError.message };
  }

  return { success: true, orderId: order.id };
}
