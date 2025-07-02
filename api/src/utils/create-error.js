const createError = (statusCode,msg,field) => {
  const err = new Error(msg)
  err.statusCode = statusCode
  err.field = field || null

  return err
}

export default createError