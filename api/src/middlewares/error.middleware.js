// const errorMiddleware = (err, req, res, next) => {
//   // console.log('err', err)

//   const { statusCode, message } = err
//   if (statusCode == 500) {
//     message = "server error"
//   }
//   res.status(statusCode).json({ message: message })
// }
// export default errorMiddleware


// มิดเดิลแวร์จัดการข้อผิดพลาด
function errorMiddleware(err, req, res, next) {
  // ตรวจสอบว่า error object มีการกำหนด statusCode หรือไม่ ถ้าไม่มีให้ใช้ค่า 500 เป็นค่าเริ่มต้น
  const statusCode = err.statusCode || 500; 
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

export default errorMiddleware