import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"GFG RIT Campus Hub" <${process.env.SMTP_USER}>`,
      to, subject, html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendEventReminder = async (to: string, eventName: string, eventDate: string): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a2e; color: #e0e0e0;">
      <h2 style="color: #2f8d46;">🎯 Event Reminder - GFG RIT</h2>
      <p>Hi there! Just a reminder about the upcoming event:</p>
      <div style="background: #16213e; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <h3 style="color: #2f8d46;">${eventName}</h3>
        <p>📅 Date: ${eventDate}</p>
      </div>
      <p>See you there! 🚀</p>
      <p style="color: #888;">— GFG RIT Campus Club</p>
    </div>
  `;
  await sendEmail(to, `Reminder: ${eventName}`, html);
};
