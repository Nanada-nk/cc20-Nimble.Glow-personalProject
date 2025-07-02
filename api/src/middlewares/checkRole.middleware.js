import createError from "../utils/create-error.js"


const checkRole = (role) => {
  return (req,res) => {
    if(req.user.role === !role) {
      createError(403, "Forbidden")
    }
  }
}



export default checkRole