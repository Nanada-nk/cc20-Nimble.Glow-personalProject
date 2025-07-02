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

usersController.updateRole = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const id = Number(req.params.id)
  const { role } = req.body

  const updatedRoleUser = await usersService.updateUser(id, {role})

  if (!updatedRoleUser) {
    return res.status(404).json({ success: false, message: 'Not found or unauthorized' })
  }
  res.status(200).json({ success: true, user: updatedRoleUser })
}

usersController.updateUser = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const id = Number(req.params.id)
  const { firstName, lastName, mobile, email, password, profileImage, addresses } = req.body
  const hashPassword = await hashService.hash(password);
  const data = {
    firstName,
    lastName,
    mobile,
    email,
    password: hashPassword,
    profileImage,
    addresses: {
      create: addresses
    }
  }
  const updatedUser = await usersService.updateUser(id, data)

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'Not found or unauthorized' })
  }
  res.status(200).json({ success: true, user: updatedUser })
}

usersController.deleteCustomer = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorized")
  }
  const id = Number(req.params.id)
  const user = await usersService.deleteUser(id)
  res.status(200).json({ success: true, user })
}

export default usersController
