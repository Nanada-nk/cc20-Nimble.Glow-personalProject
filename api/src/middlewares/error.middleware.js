const errorMiddleware = (err, req, res, next) => {
  console.error("--- UNHANDLED ERROR ---")
  console.error(err.message)
  console.error(err.stack)

  const statusCode = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

export default errorMiddleware
