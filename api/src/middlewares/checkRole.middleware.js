import createError from "../utils/create-error.js"

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError(403, "Forbidden"));
    }
    next()
  }
}

export default checkRole;
