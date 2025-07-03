import prisma from "../config/prisma.config.js"

const usersService = {}

usersService.findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { addresses: true }
  })
}

usersService.getAllUsers = () => {
  return prisma.user.findMany({
    include: { addresses: true }
  })
}

usersService.updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    include: { addresses: true }
  })
}

usersService.addAddressToUser = (userId, address) => {
  return prisma.address.create({
    data: {
      address,
      userId,
    },
  });
};

usersService.softDeleteUser = (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      enabled: false,
    },
  });
};
export default usersService
