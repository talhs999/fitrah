"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

export async function deleteCustomer(userId: string) {
  const supabase = createAdminClient();
  
  // Use auth.admin to delete the user
  const { error } = await supabase.auth.admin.deleteUser(userId);
  
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/customers");
}
