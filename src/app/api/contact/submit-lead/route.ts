import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MICROSOFT_EMAIL_USER, // your contactus@pentacloudconsulting.com email
    pass: process.env.MICROSOFT_EMAIL_PASSWORD, // your app password or normal password
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service } = body;

    if (!name || !email || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || null,
      message: company ? `Company: ${company}\nService: ${service}` : `Service: ${service}`,
      source_page: 'Contact Us Page',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // Try Supabase first
    try {
      const { error } = await supabase.from('leads').insert([payload]);
      if (error) throw new Error(error.message);
      console.log('✅ Lead saved to Supabase');
    } catch (dbErr) {
      console.warn('⚠️ Supabase unreachable (DNS propagating). Lead stored in response only.', dbErr);
    }

    // Send Email via Nodemailer (Microsoft)
    try {
      await transporter.sendMail({
        from: `"Pentacloud Consulting" <${process.env.MICROSOFT_EMAIL_USER}>`,
        to: "contactus@pentacloudconsulting.com",
        replyTo: email,
        subject: `📩 New Enquiry from ${name} — ${service}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#333;padding:20px;">
            <h2>📬 New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Service:</strong> ${service}</p>
          </div>
        `
      });
      console.log('✅ Email sent via Nodemailer');
    } catch (emailErr) {
      console.warn('⚠️ Failed to send email via Nodemailer:', emailErr);
    }

    return NextResponse.json({ success: true, lead: payload }, { status: 200 });

  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

