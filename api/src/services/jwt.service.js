import jwt from 'jsonwebtoken'

const jwtService = {}

jwtService.genToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d"
  })
}

jwtService.verifyToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256']
  })
}


export default jwtService