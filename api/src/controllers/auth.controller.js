import authService from "../services/auth.service.js"
import hashService from "../services/hash.service.js"
import jwtService from "../services/jwt.service.js"
import createError from "../utils/create-error.js"

const authController = {}

authController.register = async (req,res) => {
  const {firstName,lastName,mobile,email,password} = req.body
  const findEmail = await authService.findUserByEmail(email)

  if(findEmail) {
    throw createError(400, 'email or password invalid')
  }

  const hashPassword = await hashService.hash(password)
  console.log('hashPassword', hashPassword)

   const data = {
    firstName,
    lastName,
    mobile,
    email,
    password: hashPassword,
  }

  await authService.createUser(data)

  res.status(201).json({message:"Register User Successfully"})
}

authController.login = async (req,res) => {
  const {email,password} = req.body
  const findEmail = await authService.findUserByEmail(email)
  if(!findEmail) {
    throw createError(400,'email or password invalid')
  }

  const isMatchPassword = await hashService.comparePassword(password,findEmail.password)
  if(!isMatchPassword) {
    throw createError(400,'email or password invalid')
  }

  const preparePayload = {id:findEmail.id}

  const accessToken = await jwtService.genToken(preparePayload)

  res.status(200).json({success:true,accessToken})
}

authController.getMe = async (req,res) => {
  if(!req.user) {
    throw createError(401,"Unauthorization")
  }
  res.status(200).json({user:req.user})
}

export default authController