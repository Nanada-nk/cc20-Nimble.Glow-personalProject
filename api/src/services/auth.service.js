import prisma from "../config/prisma.config.js"

const authService = {}

authService.findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email }
  })
}

authService.findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id }
  })
}

authService.createUser = (data) => {
  return prisma.user.create({ data })
}

authService.updateUser = (id, data) => {
  return prisma.user.update({
    data,
    where: {
      id
    }
  })
}

authService.deleteUser = (id, data) => {
  return prisma.user.delete({
    data,
    where: {
      id
    }
  })
}

export default authService