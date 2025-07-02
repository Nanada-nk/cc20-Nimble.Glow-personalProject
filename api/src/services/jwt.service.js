import jwt from 'jsonwebtoken'

const jwtService = {}

jwtService.genToken = async (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "15d"
    })
  } catch (error) {
    throw new Error('Error generating token')
  }
}

jwtService.verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    })
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export default jwtService
