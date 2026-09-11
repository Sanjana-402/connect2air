import nodemailer from 'nodemailer';

export async function sendEnquiryEmail(enquiryData) {
  const { name, email, phone, company = '', message = '', eventLocation = '', source = 'Website Form' } = enquiryData;
  const recipient = process.env.NOTIFICATION_EMAIL || 'hr@connect2future.com';

  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER || 'hr@connect2future.com';
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  console.log(`[Email Notification] Initiating email delivery for enquiry from "${name}" (${email || phone})...`);

  if (!emailUser || !emailPass) {
    console.log(`[Email Notice - Development Mode] EMAIL_USER / EMAIL_PASS missing in backend/.env`);
    console.log(`[Simulated Email Payload]:`);
    console.log(`Recipient: ${recipient}`);
    console.log(`Client Name: ${name} | Phone: ${phone} | Email: ${email}`);
    console.log(`Company/Location: ${company || eventLocation}`);
    console.log(`Message: ${message}`);
    return { success: true, simulated: true };
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(name)},%20thank%20you%20for%20contacting%20Connect2Air!`;

  // Clean HTML without JSX comments
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Connect2Air New Enquiry</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #04070e; color: #ffffff; margin: 0; padding: 20px;">
      <div style="max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #00e5ff44; border-radius: 16px; background-color: #070d1c; box-shadow: 0 10px 40px rgba(0,229,255,0.15);">
        
        <!-- Header -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #00e5ff33;">
          <h1 style="color: #00e5ff; font-size: 24px; font-weight: 900; letter-spacing: 2px; margin: 0; text-transform: uppercase;">CONNECT2AIR</h1>
          <p style="color: #8899a6; font-size: 13px; font-weight: 600; margin-top: 4px; letter-spacing: 1px;">NEW AERIAL DISPLAY CAMPAIGN ENQUIRY</p>
        </div>

        <!-- Content -->
        <div style="padding: 24px 0;">
          <p style="font-size: 15px; color: #e1e8ed; margin-bottom: 18px;">
            A new campaign enquiry has been received from the website:
          </p>
          
          <table style="width: 100%; border-collapse: collapse; background-color: #04070e; border-radius: 12px; overflow: hidden; border: 1px solid #1a2638;">
            <tr>
              <td style="padding: 12px 18px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638; width: 32%;">Client Name:</td>
              <td style="padding: 12px 18px; color: #ffffff; font-size: 15px; font-weight: 700; border-bottom: 1px solid #1a2638;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Email Address:</td>
              <td style="padding: 12px 18px; color: #ffffff; border-bottom: 1px solid #1a2638;">
                ${email && email !== 'N/A' ? `<a href="mailto:${email}" style="color: #00e5ff; text-decoration: none; font-weight: bold;">${email}</a>` : '<span style="color:#888;">Not Provided</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Phone Number:</td>
              <td style="padding: 12px 18px; color: #ffffff; border-bottom: 1px solid #1a2638;">
                <a href="tel:${phone}" style="color: #25D366; text-decoration: none; font-weight: bold;">${phone}</a>
              </td>
            </tr>
            ${(company || eventLocation) ? `
            <tr>
              <td style="padding: 12px 18px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Company / Location:</td>
              <td style="padding: 12px 18px; color: #ffffff; border-bottom: 1px solid #1a2638;">${company || eventLocation}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 18px; font-weight: bold; color: #00e5ff; border-bottom: 1px solid #1a2638;">Source Form:</td>
              <td style="padding: 12px 18px; color: #ffffff; border-bottom: 1px solid #1a2638;">${source}</td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; font-weight: bold; color: #00e5ff; vertical-align: top;">Requirements / Details:</td>
              <td style="padding: 12px 18px; color: #e1e8ed; line-height: 1.6; font-size: 14px;">${message || 'No additional message provided.'}</td>
            </tr>
          </table>

          <!-- Actions -->
          <div style="margin-top: 24px; text-align: center;">
            <a href="tel:${phone}" style="display: inline-block; background-color: #00e5ff; color: #000000; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 13px; margin-right: 10px;">
              📞 Call Client (${phone})
            </a>
            <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 13px;">
              💬 WhatsApp Client
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 18px; border-top: 1px solid #00e5ff33; font-size: 12px; color: #8899a6;">
          Connect2Air Venture of Connect2Future • ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
    </html>
  `;

  // Hostinger Primary Configuration (Port 465 SSL) and Fallback (Port 587 STARTTLS)
  const portsToTry = [
    { port: Number(process.env.SMTP_PORT) || 465, secure: true },
    { port: 587, secure: false },
  ];

  for (const config of portsToTry) {
    try {
      const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
      console.log(`[SMTP Attempt] Connecting to ${smtpHost}:${config.port} (secure: ${config.secure})...`);

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: config.port,
        secure: config.secure,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
      });

      const mailOptions = {
        from: `"Connect2Air Platform" <${emailUser}>`,
        to: recipient,
        replyTo: (email && email !== 'N/A' && emailPattern.test(email)) ? email : emailUser,
        subject: `🚁 New Drone LED Display Enquiry from ${name}`,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Hostinger Email Success] Delivered to ${recipient} via port ${config.port}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId, port: config.port };
    } catch (err) {
      console.error(`[Hostinger Email Attempt Failed] Port ${config.port} error:`, err.message);
    }
  }

  return { success: false, error: 'Could not deliver email over SMTP ports 465 or 587.' };
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
