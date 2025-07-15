const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Sends an email using the configured SMTP transporter.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body content.
 * @returns {Promise<void>} Resolves when the email is sent successfully.
 */
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: config.mailer.host,
        port: config.mailer.port || 587, 
        secure: config.mailer.secure || false, 
        auth: {
          user: config.mailer.email_user,
          pass: config.mailer.email_pass,
        },
      });

  const mailOptions = {
    from: config.mailer.email_pass,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
