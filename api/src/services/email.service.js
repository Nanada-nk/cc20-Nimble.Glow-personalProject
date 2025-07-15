import nodemailer from "nodemailer";

const emailService = {}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

emailService.sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Nimble.Glow Support" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Reset Your Nimble.Glow Password",
    html: `
    <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #2F3C25; margin-bottom: 20px;">Password Reset Request</h2>
          <p>We received a request to reset the password for your Nimble.Glow account.</p>
          <p>To create a new password, please click the button below. For your security, this link is valid for the next 10 minutes.</p>
          
          <a 
            href="${resetUrl}" 
            target="_blank" 
            style="background-color: #7D8A70; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 20px 0;"
          >Reset Your Password</a>
            
          <p style="font-size: 14px; color: #666666;">If you did not request a password reset, please ignore this email. No changes will be made to your account.</p>
        </div>
        <div style="background-color: #f7f7f7; padding: 20px; text-align: left;">
          <p style="margin: 0; font-size: 14px;">Best regards,<br>The Nimble.Glow Team</p>
          <img 
            src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854695/logo_bp3ha8.png" 
            alt="Nimble.Glow Logo" 
            style="width: 120px; height: auto; margin-top: 15px;"
          >
        </div>
      </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log("Password reset email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email.")
  }
}


emailService.sendPaymentConfirmationEmail = async (payment) => {

  const { user, order } = payment;
  const shippingAddress = order.shipping?.address?.address || 'N/A';
  const formattedOrderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: `"Nimble.Glow" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Receipt for your Nimble.Glow Order #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        
        <div style="padding: 25px; border-bottom: 1px solid #e0e0e0;">
          <h2 style="color: #2F3C25; margin: 0;">Thank you for your order, ${user.firstName}!</h2>
          <p style="margin: 5px 0 0;">Here is your receipt for order #${order.orderNumber}</p>
          <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Order Date: ${formattedOrderDate}</p>
        </div>

        <div style="padding: 25px;">
          <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
              ${order.products.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0;">
                    <img src="${item.product.images[0]?.url || ''}" alt="${item.product.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                  </td>
                  <td style="padding: 10px; vertical-align: middle;">
                    <p style="margin: 0; font-weight: bold;">${item.product.title}</p>
                    <p style="margin: 0; font-size: 12px; color: #666;">Qty: ${item.count}</p>
                  </td>
                  <td style="padding: 10px; text-align: right; vertical-align: middle;">
                    ${(item.price * item.count).toFixed(2)} THB
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 5px 0;">Subtotal</td>
                <td style="padding: 5px 0; text-align: right;">${order.cartTotal.toFixed(2)} THB</td>
              </tr>
              ${order.orderDiscount > 0 ? `
                <tr>
                  <td style="padding: 5px 0;">Coupon Discount</td>
                  <td style="padding: 5px 0; text-align: right;">- ${order.orderDiscount.toFixed(2)} THB</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 5px 0; border-bottom: 2px solid #333;">Shipping</td>
                <td style="padding: 5px 0; text-align: right; border-bottom: 2px solid #333;">${(order.shippingFee || 0).toFixed(2)} THB</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; font-size: 18px;">Total Paid</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px;">${payment.amount.toFixed(2)} THB</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="padding: 25px; border-top: 1px solid #e0e0e0; background-color: #f7f7f7;">
            <h3 style="color: #333; margin-top: 0;">Address:</h3>
            <p style="margin: 0;">${shippingAddress}</p>
        </div>

        <div style="padding: 20px; text-align: left;">
          <img src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854695/logo_bp3ha8.png" alt="Nimble.Glow Logo" style="width: 120px; height: auto;">
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Receipt email sent for Order #${order.orderNumber}`);
  } catch (error) {
    console.error("Error sending receipt email:", error);
  }
};

export default emailService