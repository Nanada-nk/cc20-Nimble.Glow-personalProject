import prisma from "../config/prisma.config.js"

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

authService.updateLastLogin = async (userId) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  })
  return updatedUser
}

export default authService