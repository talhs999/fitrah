"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import Stripe from "stripe";
import { sendOrderConfirmationEmail, sendNewOrderAlertToAdmin } from "@/utils/mailer";

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  city?: string;
  country?: string;
  postal_code?: string;
  total_amount: number;
  items: { id: string; name: string; qty: number; price: number; selectedCap?: string }[];
  payment_method?: string;
}) {
  // Use service role key to bypass RLS in server actions
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get the current user session (optional, for linking order to account)
  const { data: { user } } = await supabase.auth.getUser();

  const orderPayload: any = {
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone,
    shipping_address: orderData.shipping_address,
    total_amount: orderData.total_amount,
    status: "Processing"
  };

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
    price_at_time: item.price,
    selected_cap: item.selectedCap || 'dropper'
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return { success: false, error: itemsError.message };
  }

  // Send emails concurrently to reduce wait time
  await Promise.all([
    sendOrderConfirmationEmail(
      orderData.customer_email,
      orderData.customer_name,
      order.id,
      orderData.total_amount,
      orderData.items,
      orderData.payment_method
    ).catch(console.error),
    sendNewOrderAlertToAdmin(
      order.id,
      orderData.customer_name,
      orderData.customer_email,
      orderData.total_amount,
      orderData.items,
      orderData.shipping_address
    ).catch(console.error)
  ]);

  return { success: true, orderId: order.id };
}

export async function createStripeCheckout(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  total_amount: number;
  items: { id: string; name: string; qty: number; price: number; image?: string; selectedCap?: string }[];
}) {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: settings } = await supabase.from("payment_settings").select("stripe_secret_key").single();
    if (!settings || !settings.stripe_secret_key) {
      throw new Error("Stripe is not fully configured.");
    }

    const stripe = new Stripe(settings.stripe_secret_key, { apiVersion: "2023-10-16" as any });

    // Map cart items to Stripe line items
    const lineItems = orderData.items.map(item => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          images: item.image ? [`https://www.fitrahpk.com${item.image}`] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.qty,
    }));

    // Add shipping cost if total amount implies it
    // Calculating shipping based on difference
    const itemsTotal = orderData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = orderData.total_amount - itemsTotal;
    
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "aud",
          product_data: { name: "Shipping", images: [] },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Determine the base URL for redirection
    const headersList = await headers();
    let origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;
    
    if (!origin) {
      // Fallback if origin header is missing (e.g., in some server action contexts)
      const host = headersList.get("host");
      const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
      origin = host ? `${protocol}://${host}` : "http://localhost:3000";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: orderData.customer_email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      line_items: lineItems,
      metadata: {
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone || "",
        shipping_address: orderData.shipping_address,
      }
    });

    return { success: true, url: session.url };
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return { success: false, error: error.message };
  }
}
