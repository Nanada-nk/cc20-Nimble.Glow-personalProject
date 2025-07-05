// const errorMiddleware = (err, req, res, next) => {
//   // console.log('err', err)

//   const { statusCode, message } = err
//   if (statusCode == 500) {
//     message = "server error"
//   }
//   res.status(statusCode).json({ message: message })
// }
// export default errorMiddleware


const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack)

  const statusCode = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.stack
  })
}

export default errorMiddleware
