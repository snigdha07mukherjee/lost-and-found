import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendClaimEmail(to: string, itemTitle: string) {
  try {
    await resend.emails.send({
      from: "Lost & Found <onboarding@resend.dev>",
      to,
      subject: `Someone claimed "${itemTitle}"`,
      html: `<p>Good news — someone has submitted a claim for your item <b>${itemTitle}</b>. Log in to review the claim.</p>`,
    });
  } catch (err) {
    console.error("Failed to send claim email:", err);
  }
}