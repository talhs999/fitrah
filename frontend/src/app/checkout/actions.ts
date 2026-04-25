"use server";

import { createClient } from "@/utils/supabase/server";

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  items: { id: string; qty: number; price: number }[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Insert Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id || null,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      shipping_address: orderData.shipping_address,
      total_amount: orderData.total_amount,
      status: "Processing"
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Failed to create order");
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
    // Ideally we should rollback the order here in a real scenario
    throw new Error(itemsError.message);
  }

  return { success: true, orderId: order.id };
}
