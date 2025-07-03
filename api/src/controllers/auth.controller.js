import authService from "../services/auth.service.js"
import hashService from "../services/hash.service.js"
import jwtService from "../services/jwt.service.js"
import createError from "../utils/create-error.js"
import cloudinary from "../config/cloudinary.config.js"
import fs from 'fs/promises'
import path from 'path'

const authController = {}

authController.register = async (req, res) => {
  // const { firstName, lastName, mobile, email, password, confirmPassword, profileImage, addresses } = req.body;
  const { firstName, lastName, mobile, email, password, addresses } = req.body

  if (password !== confirmPassword) {
    throw createError(400, 'Password and Confirm Password do not match')
  }

  const findEmail = await authService.findUserByEmail(email)
  if (findEmail) {
    throw createError(400, 'Email already exists')
  }

  const hashPassword = await hashService.hash(password)
  console.log('hashPassword', hashPassword)

  let uploadResult = null
  if (req.file) {
    uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nimble-glow-users',
    })
    fs.unlink(req.file.path)
  }


  const data = {
    firstName,
    lastName,
    mobile,
    email,
    password: hashPassword,
    profileImage: uploadResult?.secure_url || null,
    addresses: addresses ? { create: JSON.parse(addresses) } : undefined
  };

  const newUser = await authService.createUser(data)
  res.status(201).json({ message: "Register User Successfully", user: newUser })

  if (req.file) {
    fs.unlink(req.file.path).catch(err => console.error("Failed to delete temp file:", err))
  }
};




authController.login = async (req, res) => {
  const { email, password } = req.body
  const findEmail = await authService.findUserByEmail(email)
  if (!findEmail) {
    throw createError(400, 'Email or password invalid')
  }

  const isMatchPassword = await hashService.comparePassword(password, findEmail.password)
  if (!isMatchPassword) {
    throw createError(400, 'Email or password invalid')
  }
  await authService.updateLastLogin(findEmail.id)

  const preparePayload = { id: findEmail.id }

  const accessToken = await jwtService.genToken(preparePayload)

  res.status(200).json({ success: true, accessToken })
}

authController.getMe = async (req, res) => {
  if (!req.user) {
    throw createError(401, "Unauthorization")
  }
  const user = req.user
  if (!user) {
    throw createError(404, "User not found");
  }

  const createdAt = new Date(user.createdAt).toLocaleString()
  const updatedAt = new Date(user.updatedAt).toLocaleString()
  const lastLogin = new Date(user.lastLogin).toLocaleString()

  const { password, ...userWithoutPassword } = user

  res.status(200).json({
    user: {
      ...userWithoutPassword,
      createdAt,
      updatedAt,
      lastLogin,
    },
  })
}

export default authController