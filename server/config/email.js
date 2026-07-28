import nodemailer from "nodemailer";

/**
 * Create a reusable SMTP transporter.
 *
 * Supported providers — just set SMTP_HOST in .env:
 *   Gmail:   smtp.gmail.com   (port 587, use App Password)
 *   Outlook: smtp.office365.com
 *   Yahoo:   smtp.mail.yahoo.com
 */
export async function sendFeedbackEmail({ fromEmail, fromName, rating, comment }) {
  const toEmail = process.env.FEEDBACK_TO_EMAIL || process.env.SMTP_USER;

  if (!toEmail || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠ Email not configured — skipping feedback email. Set SMTP_USER, SMTP_PASS, FEEDBACK_TO_EMAIL in server/.env");
    return { sent: false, reason: "Email not configured" };
  }

  // Lazily create transporter so dotenv has time to load
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false, // true for 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
  });

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const senderLabel = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  const mailOptions = {
    from: `"${senderLabel}" <${process.env.SMTP_USER}>`, // Shows sender's email as the name
    replyTo: fromEmail, // so "Reply" goes to the submitter
    to: toEmail,
    subject: `⭐ New Feedback (${rating}/5) — DealDiscover`,
    text: [
      `New feedback received on DealDiscover`,
      ``,
      `From:    ${senderLabel}`,
      `Rating:  ${stars} (${rating}/5)`,
      ``,
      `Comment:`,
      `${comment}`,
      ``,
      `---`,
      `Reply directly to this email to respond to the user.`,
    ].join("\n"),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #8B1D2D, #6B5A5A); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">⭐ New Feedback Received</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">DealDiscover</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 24px; background: #fff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 80px;">From</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${senderLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Rating</td>
              <td style="padding: 8px 0; font-size: 20px; color: #eab308;">${stars} <span style="font-size: 14px; color: #6b7280;">(${rating}/5)</span></td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #8B1D2D;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">Comment</p>
            <p style="color: #111827; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${comment}</p>
          </div>
          <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
            Reply directly to this email to respond to the user.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Feedback email sent to ${toEmail} (msgId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("✗ Failed to send feedback email:", error.message);
    return { sent: false, reason: error.message };
  }
}
