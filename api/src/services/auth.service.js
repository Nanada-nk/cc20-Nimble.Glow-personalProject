import prisma from "../config/prisma.config.js"
import  emailService  from "../services/email.service.js"
import hashService from "./hash.service.js"
import crypto from 'crypto'
import createError from "../utils/create-error.js"

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

  // console.log("Password Reset Token (for testing):", resetToken)

  try {
    await emailService.sendPasswordResetEmail(user.email, resetToken);
  } catch (error) {
    
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