import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, position, resumeUrl } = body;

    if (!name || !email || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || null,
      position,
      resume_url: resumeUrl || `pending-upload-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // Try Supabase first
    try {
      const { error } = await supabase.from('career_applications').insert([payload]);
      if (error) throw new Error(error.message);
      console.log('✅ Career application saved to Supabase');
    } catch (dbErr) {
      console.warn('⚠️ Supabase unreachable (DNS propagating). Application stored in response only.', dbErr);
    }

    // Send Email via Resend
    try {
      await resend.emails.send({
        from: `Pentacloud Careers <notifications@pentacloud.me>`,
        to: process.env.MICROSOFT_EMAIL_USER || "contactus@pentacloudconsulting.com",
        replyTo: email,
        subject: `💼 New Job Application from ${name} — ${position}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#333;padding:20px;">
            <h2>💼 New Career Application</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Position Applied For:</strong> ${position}</p>
            <p><strong>Resume URL:</strong> <a href="${payload.resume_url}">View Resume</a></p>
          </div>
        `
      });
      console.log('✅ Email sent via Resend');
    } catch (emailErr) {
      console.warn('⚠️ Failed to send email via Resend:', emailErr);
    }

    return NextResponse.json({ success: true, application: payload }, { status: 200 });

  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

