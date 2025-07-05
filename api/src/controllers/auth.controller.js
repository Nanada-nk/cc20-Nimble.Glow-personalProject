import authService from "../services/auth.service.js"
import hashService from "../services/hash.service.js"
import jwtService from "../services/jwt.service.js"
import createError from "../utils/create-error.js"
import { formatDates } from "../utils/formatter.js"


const authController = {}

authController.register = async (req, res, next) => {
  const { firstName, lastName, mobile, email, password, confirmPassword } = req.body;


  if (password !== confirmPassword) {
    throw createError(400, 'Password and Confirm Password do not match')
  }

  const findEmail = await authService.findUserByEmail(email)
  if (findEmail) {
    throw createError(400, 'Email already exists')
  }

  const hashPassword = await hashService.hash(password)
  // console.log('hashPassword', hashPassword)

  const data = {
    firstName,
    lastName,
    mobile,
    email,
    password: hashPassword,
    profileImage: null
  };

  const newUser = await authService.createUser(data)
  res.status(201).json({ message: "Register User Successfully", user: formatDates(newUser) })
}


authController.login = async (req, res, next) => {
  const { email, password } = req.body
  const findEmail = await authService.findUserByEmail(email)
  if (!findEmail) {
    throw createError(401, 'Email or password invalid!')
  }

  const isMatchPassword = await hashService.comparePassword(password, findEmail.password)
  if (!isMatchPassword) {
    throw createError(401, 'Email or password invalid!!')
  }
  await authService.updateLastLogin(findEmail.id)

  // const preparePayload = { id: findEmail.id, role: findEmail.role }
  // const accessToken = await jwtService.genToken(preparePayload)
  const accessToken = await jwtService.genToken({ id: findEmail.id, role: findEmail.role })

  res.status(200).json({ success: true, accessToken })
}

authController.getMe = async (req, res, next) => {
  if (!req.user) {
    throw createError(401, "Unauthorization")
  }
  const user = req.user
  if (!user) {
    throw createError(404, "User not found");
  }

  const { password, role, ...userWithoutPasswordAndRole } = user

  // res.status(200).json({
  //   user: {
  //     ...userWithoutPasswordAndRole,
  //     createdAt: new Date(user.createdAt).toLocaleString(),
  //     updatedAt: new Date(user.updatedAt).toLocaleString(),
  //     lastLogin: new Date(user.lastLogin).toLocaleString(),
  //   }
  // })
  res.status(200).json({ user: formatDates(userWithoutPasswordAndRole) })
}


authController.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) throw createError(400, "Email is required.");

  await authService.requestPasswordReset(email);

  res.status(200).json({ message: "Password reset link sent." });
};


authController.resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw createError(400, "Token and new password are required.");

  await authService.resetPasswordWithToken(token, newPassword);

  res.status(200).json({ message: "Password has been reset successfully." });
};

export default authController