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
    where:{enabled:true},
    include: { addresses: true },
    orderBy:{id:'asc'}
  })
}

usersService.updateUser = (userId, userData) => {
  return prisma.user.update({
    where: { id: userId },
    data: userData,
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

usersService.getAddressesByUserId = (userId) => {
  return prisma.address.findMany({
    where: { userId: userId },
    orderBy: { id: 'asc' }
  });
}

usersService.deleteUserAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: userId }
  });
  if (!address) {
    throw createError(404, "Address not found or you do not have permission.");
  }
  return prisma.address.delete({ where: { id: addressId } });
}

export default usersService
