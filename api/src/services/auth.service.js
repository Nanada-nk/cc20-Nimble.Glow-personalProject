import prisma from "../config/prisma.config.js"
import { sendPasswordResetEmail } from "../utils/email.util.js"
import hashService from "./hash.service.js"

const authService = {}

authService.findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email }
  })
}

authService.findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { addresses: true }
  })
}

authService.createUser = (data) => {
  return prisma.user.create({ data })
}

authService.updateLastLogin = (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  })
}

authService.requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { passwordResetToken, passwordResetExpires }
  });

  try {
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (error) {
    console.error("Failed to send password reset email.", error);
    throw createError(500, "Could not send password reset email.");
  }
}

authService.resetPasswordWithToken = async (token, newPassword) => {

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gte: new Date() } 
    }
  });

  if (!user) {
    throw createError(400, "Password reset token is invalid or has expired.");
  }

  const hashedNewPassword = await hashService.hash(newPassword);


  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedNewPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    }
  });
}

export default authService