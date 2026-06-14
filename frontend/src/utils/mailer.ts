import nodemailer from "nodemailer";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ─── Fetch SMTP settings from DB ─────────────────────────────────────────────
async function getSmtpSettings() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}

// ─── Create transporter from DB settings ─────────────────────────────────────
async function createTransporter() {
  const settings = await getSmtpSettings();

  // Fall back to env vars if DB not configured yet
  const host = settings?.smtp_host || process.env.SMTP_HOST || "";
  const port = settings?.smtp_port || Number(process.env.SMTP_PORT) || 587;
  const secure = settings?.smtp_secure ?? (process.env.SMTP_SECURE === "true");
  const user = settings?.smtp_user || process.env.SMTP_USER || "";
  const pass = settings?.smtp_pass || process.env.SMTP_PASS || "";

  if (!host || !user || !pass) {
    return { transporter: null, settings, fromName: "Fitrah Beard Oil", adminEmail: "" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const fromName = settings?.from_name || "Fitrah Beard Oil";
  const adminEmail = settings?.admin_email || user;

  return { transporter, settings, fromName, adminEmail };
}

// ─── Shared email wrapper ─────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { transporter, fromName } = await createTransporter();
    if (!transporter) {
      console.warn("SMTP not configured. Skipping email to:", to);
      return { success: false, error: "SMTP not configured" };
    }

    const smtpSettings = await getSmtpSettings();
    const fromEmail = smtpSettings?.smtp_user || process.env.SMTP_USER || "";

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId, "→", to);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// ─── Base email wrapper ───────────────────────────────────────────────────────
function baseTemplate(content: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background:#f5f4f0;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 20px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid rgba(0,0,0,0.08);text-align:center;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;letter-spacing:4px;color:#111;font-weight:400;">FITRAH</h1>
              <p style="margin:6px 0 0;font-family:sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#999;">Beard Oil</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px 48px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 40px;border-top:1px solid rgba(0,0,0,0.06);text-align:center;">
              <p style="margin:0;font-family:sans-serif;font-size:11px;color:#aaa;line-height:1.8;">
                Fitrah Beard Oil · Lahore, Pakistan<br/>
                <a href="mailto:fitrahpk@gmail.com" style="color:#aaa;text-decoration:none;">fitrahpk@gmail.com</a> · +92 319 2801199
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
}

// ─── 1. Order Confirmation Email (to customer) ────────────────────────────────
export async function sendOrderConfirmationEmail(
  toEmail: string,
  customerName: string,
  orderId: string,
  totalAmount: number,
  items: { name: string; qty: number; price: number }[]
) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0eeea;font-family:Georgia,serif;font-size:14px;color:#333;">${item.name}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0eeea;font-family:sans-serif;font-size:13px;color:#777;text-align:center;">${item.qty}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0eeea;font-family:sans-serif;font-size:13px;color:#333;text-align:right;font-weight:600;">Rs ${(item.price * item.qty).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const content = `
    <p style="margin:0 0 8px;font-family:sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#999;">Order Confirmed</p>
    <h2 style="margin:0 0 24px;font-family:Georgia,serif;font-size:24px;color:#111;font-weight:400;">Thank you, ${customerName}.</h2>
    <p style="margin:0 0 24px;font-family:sans-serif;font-size:14px;color:#666;line-height:1.7;">
      Your order <strong style="color:#111;">#${orderId.substring(0, 8).toUpperCase()}</strong> has been placed successfully. We'll dispatch your order within 1–2 business days.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0eeea;margin-bottom:24px;">
      <thead>
        <tr>
          <th style="padding:10px 0;font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa;text-align:left;font-weight:600;">Item</th>
          <th style="padding:10px 0;font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa;text-align:center;font-weight:600;">Qty</th>
          <th style="padding:10px 0;font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa;text-align:right;font-weight:600;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="text-align:right;padding-top:12px;border-top:2px solid #111;">
      <p style="margin:0;font-family:Georgia,serif;font-size:18px;color:#111;">Total: <strong>Rs ${totalAmount.toFixed(2)}</strong></p>
    </div>
    <div style="margin-top:32px;padding:20px;background:#f5f4f0;border-left:3px solid #111;">
      <p style="margin:0;font-family:sans-serif;font-size:12px;color:#666;line-height:1.7;">
        Questions about your order? Contact us at <a href="mailto:fitrahpk@gmail.com" style="color:#111;">fitrahpk@gmail.com</a> or WhatsApp <a href="https://wa.me/923192801199" style="color:#111;">+92 319 2801199</a>
      </p>
    </div>
  `;

  return sendEmail(
    toEmail,
    `Order Confirmed — #${orderId.substring(0, 8).toUpperCase()}`,
    baseTemplate(content)
  );
}

// ─── 2. New Order Alert (to admin) ───────────────────────────────────────────
export async function sendNewOrderAlertToAdmin(
  orderId: string,
  customerName: string,
  customerEmail: string,
  totalAmount: number,
  items: { name: string; qty: number; price: number }[],
  shippingAddress: string
) {
  const { adminEmail } = await createTransporter();
  if (!adminEmail) {
    console.warn("No admin email configured.");
    return { success: false, error: "No admin email configured" };
  }

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0eeea;font-family:sans-serif;font-size:13px;color:#333;">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0eeea;font-family:sans-serif;font-size:13px;color:#777;text-align:center;">${item.qty}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0eeea;font-family:sans-serif;font-size:13px;color:#333;text-align:right;font-weight:600;">Rs ${(item.price * item.qty).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const content = `
    <div style="background:#111;color:#fff;padding:16px 20px;margin-bottom:28px;border-radius:2px;">
      <p style="margin:0;font-family:sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#aaa;">🚨 New Order Alert</p>
      <p style="margin:6px 0 0;font-family:Georgia,serif;font-size:20px;color:#fff;">Order #${orderId.substring(0, 8).toUpperCase()}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="font-family:sans-serif;font-size:12px;color:#999;padding:4px 0;">Customer</td><td style="font-family:sans-serif;font-size:13px;color:#111;font-weight:600;text-align:right;">${customerName}</td></tr>
      <tr><td style="font-family:sans-serif;font-size:12px;color:#999;padding:4px 0;">Email</td><td style="font-family:sans-serif;font-size:13px;color:#111;text-align:right;">${customerEmail}</td></tr>
      <tr><td style="font-family:sans-serif;font-size:12px;color:#999;padding:4px 0;vertical-align:top;">Ship To</td><td style="font-family:sans-serif;font-size:13px;color:#111;text-align:right;">${shippingAddress}</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0eeea;margin-bottom:24px;">
      <thead>
        <tr>
          <th style="padding:10px 0;font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa;text-align:left;font-weight:600;">Item</th>
          <th style="padding:10px 0;font-family:sans-serif;font-size:10px;text-align:center;color:#aaa;font-weight:600;">Qty</th>
          <th style="padding:10px 0;font-family:sans-serif;font-size:10px;text-align:right;color:#aaa;font-weight:600;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="text-align:right;padding-top:12px;border-top:2px solid #111;">
      <p style="margin:0;font-family:Georgia,serif;font-size:18px;color:#111;">Total: <strong>Rs ${totalAmount.toFixed(2)}</strong></p>
    </div>
  `;

  return sendEmail(
    adminEmail,
    `🛒 New Order — #${orderId.substring(0, 8).toUpperCase()} (Rs ${totalAmount.toFixed(2)})`,
    baseTemplate(content)
  );
}

// ─── 3. Newsletter Welcome Email (to subscriber, with discount code) ──────────
export async function sendNewsletterDiscountEmail(
  toEmail: string,
  discountPercent: number,
  discountCode: string
) {
  const content = `
    <p style="margin:0 0 8px;font-family:sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#999;">Welcome to Fitrah</p>
    <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;color:#111;font-weight:400;">Your ${discountPercent}% discount is here.</h2>
    <p style="margin:0 0 32px;font-family:sans-serif;font-size:14px;color:#666;line-height:1.7;">
      Thank you for subscribing to the Fitrah newsletter. Use the exclusive code below on your first order to claim your discount.
    </p>
    <div style="text-align:center;padding:32px;background:#111;margin-bottom:32px;">
      <p style="margin:0 0 8px;font-family:sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#aaa;">Your Discount Code</p>
      <p style="margin:0;font-family:Georgia,serif;font-size:32px;letter-spacing:6px;color:#fff;font-weight:400;">${discountCode}</p>
      <p style="margin:12px 0 0;font-family:sans-serif;font-size:12px;color:#aaa;">${discountPercent}% off your entire order</p>
    </div>
    <div style="text-align:center;">
      <a href="https://fitrah-ecommerce.vercel.app/shop" style="display:inline-block;background:#111;color:#fff;padding:14px 40px;font-family:sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;font-weight:600;">Shop Now →</a>
    </div>
    <p style="margin:32px 0 0;font-family:sans-serif;font-size:11px;color:#aaa;line-height:1.7;text-align:center;">
      This code is valid for one use only. Cannot be combined with other offers.
    </p>
  `;

  return sendEmail(
    toEmail,
    `Your ${discountPercent}% Discount Code — Fitrah Beard Oil`,
    baseTemplate(content)
  );
}

// ─── 4. Contact Form Email (to admin) ────────────────────────────────────────
export async function sendContactFormEmail(
  fromName: string,
  fromEmail: string,
  subject: string,
  message: string
) {
  const { adminEmail } = await createTransporter();
  const recipientEmail = adminEmail || process.env.SMTP_USER || "";

  if (!recipientEmail) {
    console.warn("No admin email configured for contact form.");
    return { success: false, error: "No admin email configured" };
  }

  const content = `
    <div style="background:#f5f4f0;padding:16px 20px;margin-bottom:28px;border-left:3px solid #111;">
      <p style="margin:0;font-family:sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#999;">New Contact Form Message</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="font-family:sans-serif;font-size:12px;color:#999;padding:6px 0;width:80px;">From</td><td style="font-family:sans-serif;font-size:13px;color:#111;font-weight:600;">${fromName}</td></tr>
      <tr><td style="font-family:sans-serif;font-size:12px;color:#999;padding:6px 0;">Email</td><td style="font-family:sans-serif;font-size:13px;color:#111;"><a href="mailto:${fromEmail}" style="color:#111;">${fromEmail}</a></td></tr>
      <tr><td style="font-family:sans-serif;font-size:12px;color:#999;padding:6px 0;">Subject</td><td style="font-family:sans-serif;font-size:13px;color:#111;">${subject}</td></tr>
    </table>
    <div style="border-top:1px solid #f0eeea;padding-top:20px;">
      <p style="margin:0 0 8px;font-family:sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Message</p>
      <p style="margin:0;font-family:sans-serif;font-size:14px;color:#333;line-height:1.8;white-space:pre-line;">${message}</p>
    </div>
    <div style="margin-top:28px;padding:16px;background:#f5f4f0;">
      <p style="margin:0;font-family:sans-serif;font-size:12px;color:#666;">
        Reply directly to this email to respond to ${fromName}.
      </p>
    </div>
  `;

  return sendEmail(
    recipientEmail,
    `📩 Contact Form: ${subject} — from ${fromName}`,
    baseTemplate(content)
  );
}
