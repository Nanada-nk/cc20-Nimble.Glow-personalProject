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

const app = express()

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.'
})

app.use(express.json())
app.use(cors())
app.use(limiter)
app.use(morgan("dev")) // log
app.use(compression())


app.use('/api/auth', authRouter)
app.use('/api/users', authenticateUser, usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/cart', authenticateUser, cartRouter)
app.use('/api/orders', authenticateUser, ordersRouter)
// app.use('/api/payments',()=>{})
// app.use('/api/shipping',()=>{})
// app.use('/api/reviews',()=>{})
// app.use('/api/coupons',()=>{})


app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app