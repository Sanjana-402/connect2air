import nodemailer from 'nodemailer';

export async function sendEnquiryEmail(enquiryData) {
  const { name, email, phone, company = '', message = '', eventLocation = '', source = 'Website Form' } = enquiryData;
  const recipient = process.env.NOTIFICATION_EMAIL || 'hr@connect2future.com';

  console.log(`[Email Notification] Preparing enquiry notification for ${recipient}...`);

  // Create transporter using environment variables or test ethereal transport
  let transporter;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development / Fallback logger
    console.log(`[Email Log] Simulated email sent to ${recipient}:`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Phone: ${phone} | Company/Location: ${company || eventLocation}`);
    console.log(`Message: ${message}`);
    return { success: true, simulated: true };
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #00e5ff; border-radius: 12px; background-color: #04070e; color: #ffffff;">
      <div style="text-align: center; padding-bottom: 15px; border-bottom: 1px solid #00e5ff33;">
        <h2 style="color: #00e5ff; margin: 0; text-transform: uppercase;">Connect2Air</h2>
        <p style="color: #8899a6; font-size: 12px; margin-top: 4px;">New Aerial Display Campaign Enquiry</p>
      </div>

      <div style="padding: 20px 0;">
        <p style="font-size: 14px; color: #e1e8ed;">You have received a new inquiry from the Connect2Air website:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: #070d1c; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 10px 15px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638; width: 35%;">Client Name:</td>
            <td style="padding: 10px 15px; color: #ffffff; border-bottom: 1px solid #1a2638;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Email Address:</td>
            <td style="padding: 10px 15px; color: #ffffff; border-bottom: 1px solid #1a2638;"><a href="mailto:${email}" style="color: #00e5ff;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Phone Number:</td>
            <td style="padding: 10px 15px; color: #ffffff; border-bottom: 1px solid #1a2638;"><a href="tel:${phone}" style="color: #25D366;">${phone}</a></td>
          </tr>
          ${(company || eventLocation) ? `
          <tr>
            <td style="padding: 10px 15px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Company / Location:</td>
            <td style="padding: 10px 15px; color: #ffffff; border-bottom: 1px solid #1a2638;">${company || eventLocation}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 15px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Submission Source:</td>
            <td style="padding: 10px 15px; color: #ffffff; border-bottom: 1px solid #1a2638;">${source}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: bold; color: #00e5ff; vertical-align: top;">Requirements:</td>
            <td style="padding: 10px 15px; color: #ffffff; line-height: 1.5;">${message || 'No additional message provided.'}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; padding-top: 15px; border-top: 1px solid #00e5ff33; font-size: 11px; color: #8899a6;">
        Sent automatically from Connect2Air Platform • ${new Date().toLocaleString()}
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Connect2Air Platform" <${process.env.SMTP_FROM || 'no-reply@connect2air.com'}>`,
      to: recipient,
      subject: `🚁 New Drone LED Display Enquiry from ${name}`,
      html: htmlContent,
    });
    console.log(`[Email Sent] Successfully delivered to ${recipient}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Error] Failed to send email to ${recipient}:`, err);
    return { success: false, error: err.message };
  }
}
