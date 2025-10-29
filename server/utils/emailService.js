const nodemailer = require('nodemailer');

// Email service using Nodemailer with Gmail SMTP
class EmailService {
  constructor() {
    this.gmailEmail = process.env.GMAIL_EMAIL;
    this.gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    
    // Initialize transporter
    if (this.gmailEmail && this.gmailAppPassword) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.gmailEmail,
          pass: this.gmailAppPassword
        }
      });
      console.log('📧 EmailService Initialized (Nodemailer):');
      console.log(`   Gmail: ${this.gmailEmail}`);
      console.log(`   Status: ✓ Ready`);
    } else {
      console.warn('⚠️  Gmail credentials not configured in .env');
      console.warn(`   GMAIL_EMAIL: ${this.gmailEmail ? '✓ Loaded' : '✗ Missing'}`);
      console.warn(`   GMAIL_APP_PASSWORD: ${this.gmailAppPassword ? '✓ Loaded' : '✗ Missing'}`);
      this.transporter = null;
    }
  }

  /**
   * Send credentials email to new family member via Gmail SMTP
   * @param {string} recipientEmail - Email address to send credentials to
   * @param {string} firstName - First name of the person
   * @param {string} lastName - Last name of the person
   * @param {string} username - Username for login (format: firstName_sNo)
   * @param {string} tempPassword - Temporary password generated
   * @param {number} sNo - Serial number assigned to the member
   * @returns {Promise<Object>} - Email send result
   */
  async sendCredentialsEmail(recipientEmail, firstName, lastName, username, tempPassword, sNo) {
    if (!this.transporter) {
      console.warn('⚠️  Gmail credentials not configured. Email will not be sent.');
      return {
        success: false,
        error: 'Gmail credentials not configured',
        recipient: recipientEmail
      };
    }

    const fullName = `${firstName} ${lastName}`;
    
    // Create HTML email template
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50;">Welcome to Bal Krishna Nivas!</h2>
            
            <p>Dear <strong>${fullName}</strong>,</p>
            
            <p>Your account has been successfully created. Here are your login credentials:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Username:</strong> <code style="background-color: #e9ecef; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${username}</code></p>
              <p><strong>Email:</strong> ${recipientEmail}</p>
              <p><strong>Temporary Password:</strong> <code style="background-color: #e9ecef; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${tempPassword}</code></p>
              <p><strong>Serial Number:</strong> ${sNo}</p>
            </div>
            
            <p>Please log in and change your password immediately for security purposes.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #666;">
              If you have any questions, please contact us at <strong>balkrishnanivas@gmail.com</strong>
            </p>
            
            <p style="font-size: 12px; color: #999;">
              This is an automated email. Please do not reply directly to this message.
            </p>
          </div>
        </body>
      </html>
    `;

    const plainTextContent = `
Welcome to Bal Krishna Nivas!

Dear ${fullName},

Your account has been successfully created. Here are your login credentials:

Username: ${username}
Email: ${recipientEmail}
Temporary Password: ${tempPassword}
Serial Number: ${sNo}

Please log in and change your password immediately for security purposes.

If you have any questions, please contact us at balkrishnanivas@gmail.com

---
This is an automated email. Please do not reply directly to this message.
    `;

    console.log('📤 Sending email via Gmail SMTP (Nodemailer)...');
    console.log(`   From: ${this.gmailEmail}`);
    console.log(`   To: ${recipientEmail}`);
    console.log(`   Username: ${username}`);
    console.log(`   Serial Number: ${sNo}`);
    console.log(`   Subject: Welcome to Bal Krishna Nivas`);

    try {
      const mailOptions = {
        from: this.gmailEmail,
        to: recipientEmail,
        subject: 'Welcome to Bal Krishna Nivas - Your Login Credentials',
        html: htmlContent,
        text: plainTextContent,
        replyTo: this.gmailEmail
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log(`✉️  Email sent successfully!`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Response: ${info.response}`);

      return {
        success: true,
        recipient: recipientEmail,
        messageId: info.messageId
      };
    } catch (error) {
      console.error(`❌ Error sending credentials email to ${recipientEmail}`);
      console.error(`   Error Message: ${error.message}`);
      if (error.code) {
        console.error(`   Error Code: ${error.code}`);
      }
      return {
        success: false,
        error: error.message,
        recipient: recipientEmail
      };
    }
  }
}

module.exports = new EmailService();