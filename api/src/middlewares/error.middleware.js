const errorMiddleware = (err, req, res, next) => {
  console.log('err', err)

  const { statusCode, message } = err
  if (statusCode == 500) {
    message = "server error"
  }
  res.status(statusCode).json({ message: message })
}
export default errorMiddleware