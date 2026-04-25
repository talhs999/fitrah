import { createAdminClient } from "@/utils/supabase/admin";
import CustomersClient from "./CustomersClient";

export const metadata = { title: "Manage Customers — Fitrah Admin" };

export default async function AdminCustomersPage() {
  const supabase = createAdminClient();
  
  // List all users from Supabase Auth
  const { data, error } = await supabase.auth.admin.listUsers();
  
  const users = data?.users || [];

  return <CustomersClient users={users} />;
}
