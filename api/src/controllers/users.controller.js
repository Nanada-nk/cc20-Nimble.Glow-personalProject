import hashService from "../services/hash.service.js"
import usersService from "../services/users.service.js"
import createError from "../utils/create-error.js"
import fs from 'fs/promises';
import { formatDates } from "../utils/formatter.js"
import cloudinary from "../config/cloudinary.config.js"

const usersController = {}

usersController.getListAllUser = async (req, res, next) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const users = await usersService.getAllUsers()
  res.status(200).json({ success: true, users: formatDates(users) })
}


usersController.updateUserStatus = async (req, res, next) => {
  const targetUserId = Number(req.params.id);
  const { role, enabled } = req.body;

  if (role === undefined && enabled === undefined) {
    throw createError(400, "Role or enabled status is required.");
  }
  const dataToUpdate = {};
  if (role) dataToUpdate.role = role;
  if (enabled !== undefined) dataToUpdate.enabled = JSON.parse(enabled)

  const updatedUser = await usersService.updateUser(targetUserId, dataToUpdate);
  res.status(200).json({ success: true, user: formatDates(updatedUser) });
}

usersController.updateMyProfile = async (req, res, next) => {
  const myUserId = req.user.id;
  const { firstName, lastName, mobile, email } = req.body;
  const data = { firstName, lastName, mobile, email };

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'nimble-glow-users' });
      data.profileImage = result.secure_url;
    } finally {
      await fs.unlink(req.file.path);
    }
  }
  const updatedUser = await usersService.updateUser(myUserId, data);
  const { password, ...userWithoutPassword } = updatedUser
  res.status(200).json({ success: true, user: formatDates(userWithoutPassword) });
}

usersController.getAddressesForCurrentUser = async (req, res, next) => {
  const userId = req.user.id;
  const addresses = await usersService.getAddressesByUserId(userId);
  res.status(200).json({ success: true, addresses: addresses });
};

usersController.addMyAddress = async (req, res, next) => {
  const myUserId = req.user.id;
  const { address } = req.body;
  if (!address) throw createError(400, "Address is required.");

  const newAddress = await usersService.addAddressToUser(myUserId, address);
  res.status(201).json({ success: true, address: newAddress });
}

usersController.updateMyAddress = async (req, res, next) => {
  const myUserId = req.user.id;
  const addressId = Number(req.params.addressId);
  const { address } = req.body;
  if (!address) throw createError(400, "Address is required.");

  const updatedAddress = await usersService.updateUserAddress(myUserId, addressId, address);
  res.status(200).json({ success: true, address: updatedAddress });
}

usersController.deleteAddress = async (req, res, next) => {
  const userId = req.user.id;
  const { addressId } = req.params;
  await usersService.deleteUserAddress(userId, Number(addressId));
  res.status(204).json();
};

usersController.disableUser = async (req, res, next) => {
  const id = Number(req.params.id);

  const userToDisable = await usersService.findUserById(id);
  if (!userToDisable) {
    throw createError(404, "User not found");
  }

  const softDeleteUser = await usersService.softDeleteUser(id);

  res.status(200).json({
    success: true,
    message: `User with ID ${id} has been disabled successfully.`,
    softDeleteUser: formatDates(softDeleteUser)
  });
}

usersController.changeMyPassword = async (req, res, next) => {
  const myUserId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw createError(400, "Current password and new password are required.");
  }

  const user = await usersService.findUserById(myUserId);
  const isMatch = await hashService.comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw createError(401, "Current password is not correct.");
  }

  const hashedNewPassword = await hashService.hash(newPassword);
  await usersService.updateUser(myUserId, { password: hashedNewPassword });

  res.status(200).json({ success: true, message: "Password changed successfully." });
}



export default usersController
