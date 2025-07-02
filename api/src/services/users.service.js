import prisma from "../config/prisma.config.js"

const usersService = {}

usersService.findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    include:{addresses:true}
  })
}

usersService.getAllUsers = () => {
  return prisma.user.findMany({
    include:{addresses:true}
  })
}

usersService.updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    include:{addresses:true}
  })
}

usersService.deleteUser = (id) => {
  return prisma.user.delete({
    where: { id }
  })
}

export default usersService
