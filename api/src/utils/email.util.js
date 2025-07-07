import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * note ไว้เดี๋ยวลืม
 * @param {string} to - 
 * @param {string} token 
 */
export async function sendPasswordResetEmail(to, token) {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Nimble.Glow Support" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Password Reset Request for Your Nimble.Glow Account',
    html: `
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}