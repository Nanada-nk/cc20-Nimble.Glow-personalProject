import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import errorMiddleware from './middlewares/error.middleware.js'
import notFoundMiddleware from './middlewares/not-found.middleware.js'
import authRouter from './routes/auth.route.js'
import usersRouter from './routes/users.route.js'
import authenticateUser from './middlewares/authenticate.middleware.js'
import rateLimit from 'express-rate-limit'
import categoriesRouter from './routes/categories.route.js'
import productsRouter from './routes/products.route.js'
import cartRouter from './routes/cart.route.js'
import ordersRouter from './routes/orders.route.js'
import shippingRouter from './routes/shipping.route.js'
import paymentRouter from './routes/payment.route.js'
import reviewRouter from './routes/review.route.js'
import couponRouter from './routes/coupon.route.js'

const app = express()

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.'
})

app.use(express.json())
app.use(cors())
app.use(limiter)
app.use(morgan("dev"))
app.use(compression())


app.use('/api/auth', authRouter)
app.use('/api/users', authenticateUser, usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/cart', authenticateUser, cartRouter)
app.use('/api/orders', authenticateUser, ordersRouter)
app.use('/api/payments',paymentRouter)
app.use('/api/shipping',shippingRouter)
app.use('/api/reviews',reviewRouter)
app.use('/api/coupons', couponRouter)


app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app