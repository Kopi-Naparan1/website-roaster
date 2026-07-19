import { Resend } from "resend";
import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let resend: Resend | null = null;
function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "contact-form",
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success: withinLimit } = await ratelimit.limit(ip);
  if (!withinLimit) {
    return Response.json(
      { success: false, error: "Too many requests. Try again later." },
      { status: 429 },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return Response.json(
      { success: false, error: "All fields are required" },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return Response.json(
      { success: false, error: "Invalid email address" },
      { status: 400 },
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return Response.json(
      { success: false, error: "Message is too long" },
      { status: 400 },
    );
  }

  const SUBJECT = "Vex: Website Roaster Message";

  try {
    const resendClient = getResendClient();

    await resendClient.emails.send({
      from: "Vex: Website Roaster <onboarding@resend.dev>",
      replyTo: email,
      to: "kopinaparan13@gmail.com",
      subject: SUBJECT,
      html: `
        <h2>New Message!</h2>

        <h3>Name:</h3>
        <p>${escapeHtml(name)}</p>

        <h3>Email:</h3>
        <p>${escapeHtml(email)}</p>
        <p>--------------------------</p>
        <p></p>
        <h3>Message:</h3>

        <p>${escapeHtml(message)}</p>
        <p></p>

        <p>--------------------------</p>
        <p>NOTE TO SELF: Respond Professionally</p>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json(
      { success: false, error: "Failed to send the email" },
      { status: 500 },
    );
  }
}
