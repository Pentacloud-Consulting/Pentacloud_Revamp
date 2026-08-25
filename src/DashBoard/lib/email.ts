import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MICROSOFT_EMAIL_USER,
    pass: process.env.MICROSOFT_EMAIL_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

export async function sendEmail({
  to = process.env.MICROSOFT_EMAIL_USER || 'contactus@pentacloudconsulting.com',
  subject,
  html,
}: {
  to?: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MICROSOFT_EMAIL_USER,
      to,
      subject,
      html,
    });
    return { success: true, data: info };
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    return { success: false, error };
  }
}
