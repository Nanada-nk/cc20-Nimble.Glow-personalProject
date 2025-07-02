import authService from "../services/auth.service.js"
import hashService from "../services/hash.service.js"
import jwtService from "../services/jwt.service.js"
import createError from "../utils/create-error.js"

const authController = {}

authController.register = async (req, res) => {
  const { firstName, lastName, mobile, email, password, confirmPassword, profileImage, addresses } = req.body;

  if (password !== confirmPassword) {
    throw createError(400, 'Password and Confirm Password do not match');
  }

  const findEmail = await authService.findUserByEmail(email);
  if (findEmail) {
    throw createError(400, 'Email already exists');
  }

  const hashPassword = await hashService.hash(password);
  console.log('hashPassword', hashPassword);


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

  const newUser = await authService.createUser(data);
  console.log('newUser', newUser)
  res.status(201).json({ message: "Register User Successfully" });
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
  const user = await authService.findUserById(req.user.id)
  if (!user) {
    throw createError(404, "User not found");
  }

  const createdAt = new Date(user.createdAt).toLocaleString()
  const updatedAt = new Date(user.updatedAt).toLocaleString()
  const lastLogin = new Date(user.lastLogin).toLocaleString()

  res.status(200).json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      enabled: user.enabled,
      createdAt,   
      updatedAt,   
      lastLogin,   
      addresses: user.addresses,
    }
  })
}

export default authController