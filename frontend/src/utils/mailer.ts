import nodemailer from "nodemailer";

export async function sendOrderConfirmationEmail(
  toEmail: string,
  customerName: string,
  orderId: string,
  totalAmount: number,
  items: { name: string; qty: number; price: number }[]
) {
  try {
    // Check if SMTP credentials exist
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not configured. Skipping order confirmation email.");
      return { success: false, error: "SMTP not configured" };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `).join("");

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">Order Confirmed</h1>
        <p>Jazakallah Khair, <strong>${customerName}</strong>!</p>
        <p>Your order <strong>#${orderId.substring(0, 8).toUpperCase()}</strong> has been placed successfully.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="background: #faf9f6; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="text-align: center; font-size: 12px; color: #666; margin-top: 50px;">
          Fitrah Beard Oil<br/>
          Lahore, Pakistan
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Fitrah Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Order Confirmation - #${orderId.substring(0, 8).toUpperCase()}`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: (error as Error).message };
  }
}
