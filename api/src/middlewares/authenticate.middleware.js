
import jwtService from "../services/jwt.service.js"
import userService from "../services/user.service.js"
import createError from "../utils/create-error.js"


const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization
  // console.log('authHeader', authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError(401, 'Unauthorized')
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    throw createError(401, 'Unauthorized!')
  }

  const payload = jwtService.verifyToken(token)
  if (!payload.id) {
    throw createError(401, 'Unauthorized!!')
  }

  const { password, ...user } = await userService.findUserById(payload.id)
  if (!user) {
    throw createError(403, 'Unauthorized!!!')
  }

  req.user = user
  next()
}

export default authenticateUser