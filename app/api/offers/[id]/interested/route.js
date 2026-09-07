import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req, context) {
  // unwrap params safely (Next may pass a Promise)
  const params = context?.params && typeof context.params.then === "function"
    ? await context.params
    : context?.params;
  const id = params?.id;

  try {
    const body = await req.json().catch(() => ({}));
    const senderEmail = body.senderEmail || "anonymous";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ message: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const svc = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data, error } = await svc
      .from("offers")
      .select("id, title, owner_id, profiles(email, display_name)")
      .eq("id", id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("supabase service fetch error", error);
      return NextResponse.json({ message: "DB fetch error" }, { status: 500 });
    }
    if (!data) return NextResponse.json({ message: "Offer not found" }, { status: 404 });

    const ownerEmail = data.profiles?.email;
    if (!ownerEmail) return NextResponse.json({ message: "Owner email not available" }, { status: 400 });

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    const from = `${process.env.FROM_NAME || "troCASH"} <${process.env.FROM_EMAIL}>`;
    const subject = `[troCASH] Хтось зацікавився: ${data.title || "ваша пропозиція"}`;
    const text = `Користувач (${senderEmail}) зацікавлений у вашій пропозиції "${data.title || ''}".`;

    await transporter.sendMail({
      from,
      to: ownerEmail,
      subject,
      text,
      html: `<p>Користувач (<strong>${senderEmail}</strong>) зацікавлений у вашій пропозиції "<strong>${data.title || ''}</strong>".</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("interested route error", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}