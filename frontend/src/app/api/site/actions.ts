"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { sendNewsletterDiscountEmail } from "@/utils/mailer";

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; error?: string; alreadySubscribed?: boolean }> {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch newsletter settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("id, newsletter_enabled, newsletter_discount_percent, newsletter_discount_code, newsletter_max_uses, newsletter_use_count")
      .single();

    if (!settings?.newsletter_enabled) {
      return { success: false, error: "Newsletter is currently unavailable." };
    }

    // Check if already subscribed
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      return { success: true, alreadySubscribed: true };
    }

    // Check max uses (0 = unlimited)
    const maxUses = settings.newsletter_max_uses ?? 0;
    const useCount = settings.newsletter_use_count ?? 0;
    if (maxUses > 0 && useCount >= maxUses) {
      return { success: false, error: "This offer has reached its maximum number of uses." };
    }

    // Save subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        discount_code: settings.newsletter_discount_code,
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // Increment use count
    await supabase
      .from("site_settings")
      .update({ newsletter_use_count: useCount + 1 })
      .eq("id", (settings as any)?.id ?? "");

    // Send the welcome email with discount code
    await sendNewsletterDiscountEmail(
      email,
      settings.newsletter_discount_percent ?? 10,
      settings.newsletter_discount_code ?? "WELCOME10"
    );

    return { success: true };
  } catch (error: any) {
    console.error("Newsletter subscribe error:", error);
    return { success: false, error: error.message };
  }
}

export async function sendContactMessage(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { sendContactFormEmail } = await import("@/utils/mailer");
    const result = await sendContactFormEmail(
      `${data.firstName} ${data.lastName}`,
      data.email,
      data.subject,
      data.message
    );
    return result;
  } catch (error: any) {
    console.error("Contact form error:", error);
    return { success: false, error: error.message };
  }
}

export async function validateCouponCode(code: string): Promise<{
  valid: boolean;
  type?: string;
  value?: number;
  error?: string;
}> {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check newsletter discount code in site_settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("newsletter_discount_code, newsletter_discount_percent, newsletter_max_uses, newsletter_use_count")
      .single();

    if (
      settings &&
      settings.newsletter_discount_code &&
      code.toUpperCase() === settings.newsletter_discount_code.toUpperCase()
    ) {
      const maxUses = settings.newsletter_max_uses ?? 0;
      const useCount = settings.newsletter_use_count ?? 0;
      if (maxUses > 0 && useCount >= maxUses) {
        return { valid: false, error: "This coupon has reached its maximum uses." };
      }
      return {
        valid: true,
        type: "percentage",
        value: settings.newsletter_discount_percent ?? 10,
      };
    }

    return { valid: false, error: "Invalid or expired coupon code." };
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return { valid: false, error: "Could not validate coupon. Please try again." };
  }
}
