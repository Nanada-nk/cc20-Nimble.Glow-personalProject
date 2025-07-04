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
}

usersService.updateUserAddress = async (userId, addressId, newAddress) => {

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: userId }
  });
  if (!address) {
    throw createError(404, "Address not found or you do not have permission.");
  }
  return prisma.address.update({
    where: { id: addressId },
    data: { address: newAddress }
  });
}

usersService.softDeleteUser = (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      enabled: false,
    },
  });
}

export default usersService
