"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function cancelUserOrder(orderId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to cancel an order.");
  }

  // Ensure the order belongs to the user and is still in "Processing" state
  const { data: order } = await supabase
    .from("orders")
    .select("status, user_id")
    .eq("id", orderId)
    .single();

  if (!order || order.user_id !== user.id) {
    throw new Error("Order not found or unauthorized.");
  }

  if (order.status !== "Processing") {
    throw new Error("Only processing orders can be cancelled.");
  }

  const { error } = await supabase
    .from("orders")
    .update({ 
      status: "Cancelled",
      cancellation_reason: reason
    })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/account");
  revalidatePath("/admin/orders");
}
