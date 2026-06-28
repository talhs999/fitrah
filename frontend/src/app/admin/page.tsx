import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Admin Dashboard — Fitrah",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  // Fetch real data
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  const { data: products } = await supabase.from("products").select("id");
  const { data: paymentSettings } = await supabase.from("payment_settings").select("currency").single();
  
  // Fetch users for growth metrics
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();

  let currencySymbol = "$";
  if (paymentSettings?.currency === "PKR") currencySymbol = "Rs ";
  else if (paymentSettings?.currency === "GBP") currencySymbol = "£";
  else if (paymentSettings?.currency === "EUR") currencySymbol = "€";

  return (
    <DashboardClient 
        orders={orders || []} 
        productsCount={products?.length || 0} 
        currencySymbol={currencySymbol} 
        users={users || []}
    />
  );
}
