import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "Unknown IP";

    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),

      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Visitor Alert" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to: process.env.NEXT_PUBLIC_NOTIFY_EMAIL,
      subject: "Someone visited your website",
      text: `New visitor!\n\nIP: ${ip}\nDevice: ${userAgent}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const ip = req.headers.get("x-forwarded-for") || "Unknown IP";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"User Action" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to: process.env.NEXT_PUBLIC_NOTIFY_EMAIL,
      subject: "User Clicked Button",
      text: `🔥 User Interaction!

Action: ${action}

IP: ${ip}
Device: ${userAgent}
Time: ${new Date().toLocaleString()}
`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "POST failed" }, { status: 500 });
  }
}
