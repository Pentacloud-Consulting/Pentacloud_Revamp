import { NextResponse } from 'next/server';
import { createClientServer } from '../../../../DashBoard/lib/supabase';
import { sendEmail } from '../../../../DashBoard/lib/email';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const resume = formData.get('resume') as File;

    if (!name || !email || !resume) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClientServer();
    
    // Upload resume to Supabase Storage
    const fileExt = resume.name.split('.').pop();
    const fileName = `resumes/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, resume);
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);

    // Save to DB
    const { data, error: dbError } = await supabase.from('career_applications').insert([{
      name,
      email,
      phone,
      position: position || 'General Application',
      resume_url: publicUrl,
      status: 'new'
    }]).select().single();

    if (dbError) {
      console.error('Supabase error inserting application:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Send email notification
    await sendEmail({
      subject: `New Career Application: ${name} for ${position || 'General'}`,
      html: `
        <h2>New Application Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Position:</strong> ${position || 'General Application'}</p>
        <p><a href="${publicUrl}" style="display:inline-block;padding:10px 15px;background:#0066cc;color:white;text-decoration:none;border-radius:4px;">Download Resume</a></p>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
