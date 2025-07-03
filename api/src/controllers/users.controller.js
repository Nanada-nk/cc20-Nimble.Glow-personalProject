import hashService from "../services/hash.service.js"
import usersService from "../services/users.service.js"
import createError from "../utils/create-error.js"

const usersController = {}

usersController.getListAllUser = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const users = await usersService.getAllUsers()
  res.status(200).json({ success: true, users })
}

usersController.getUserById = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const id = Number(req.params.id)
  const user = await usersService.findUserById(id)
  if (!user) {
    throw createError(404, "User not found");
  }
  res.status(200).json({ success: true, user })
}

usersController.updateUserStatus = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const id = Number(req.params.id)
  const { role, enabled } = req.body

  if (role === undefined && enabled === undefined) {
    throw createError(400, "At least one field (role or enabled) is required")
  }

  const dataToUpdate = {};
  if (role) {
    dataToUpdate.role = role
  }
  if (enabled !== undefined) {
    dataToUpdate.enabled = enabled
  }

  const updatedUser = await usersService.updateUser(id, dataToUpdate)
  res.status(200).json({ success: true, user: updatedUser })
}

usersController.updateUser = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const id = Number(req.params.id)
  if (req.user.id !== id && req.user.role !== 'SUPERADMIN') {
    throw createError(403, "Forbidden: You can only update your own profile.");
  }
  const { firstName, lastName, mobile, profileImage } = req.body

  const data = {
    firstName,
    lastName,
    mobile,
    profileImage
  }
  const updatedUser = await usersService.updateUser(id, data)

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'Not found or unauthorized' })
  }
  res.status(200).json({ success: true, user: updatedUser })
}

usersController.forgotPassword = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const id = Number(req.params.id)
  const { password } = req.body;

  if (req.user.id !== id) {
    throw createError(403, "Forbidden: You can only change your own password.");
  }

  const hashPassword = await hashService.hash(password);
  const data = {
    password: hashPassword,
  };

  const updatedUser = await usersService.updateUser(id, data);
  res.status(200).json({ success: true, message: "Password updated successfully", updatedUser })
}

usersController.addAddress = async (req, res, next) => {
  const { userId } = req.params;
  const { address } = req.body;

  if (req.user.id !== Number(userId)) {
    throw createError(403, "Forbidden: You can only add an address to your own profile.");
  }

  if (!address || typeof address !== 'string' || address.trim() === '') {
    throw createError(400, "Address is required and must be a non-empty string.");
  }

  const newAddress = await usersService.addAddressToUser(Number(userId), address);
  res.status(201).json({ success: true, address: newAddress });
};


usersController.disableUser = async (req, res, next) => {
  const id = Number(req.params.id);

  const userToDisable = await usersService.findUserById(id);
  if (!userToDisable) {
    throw createError(404, "User not found");
  }

  const softDeleteUser = await usersService.softDeleteUser(id);

  res.status(204).json({ success: true, softDeleteUser });
};

export default usersController
