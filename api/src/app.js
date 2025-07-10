import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import authenticateUser from './middlewares/authenticate.middleware.js'
import notFoundMiddleware from './middlewares/not-found.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'

import authRouter from './routes/auth.route.js'
import usersRouter from './routes/users.route.js'
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
  windowMs: 5 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.'
})

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(limiter)
app.use(express.json())
app.use(morgan("dev"))
app.use(compression())


app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/coupons', couponRouter);


app.use('/api/users', authenticateUser, usersRouter);
app.use('/api/cart', authenticateUser, cartRouter);
app.use('/api/orders', authenticateUser, ordersRouter);
app.use('/api/payments', authenticateUser, paymentRouter);
app.use('/api/shipping', authenticateUser, shippingRouter);


app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app