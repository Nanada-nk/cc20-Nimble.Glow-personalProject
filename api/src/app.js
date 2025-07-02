import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import errorMiddleware from './middlewares/error.middleware.js'
import notFoundMiddleware from './middlewares/not-found.middleware.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev")) // log
app.use(compression())


app.use('/api/auth',()=>{})
app.use('/api/users',()=>{})
app.use('/api/categories',()=>{})
app.use('/api/products',()=>{})
app.use('/api/cart',()=>{})
app.use('/api/orders',()=>{})
app.use('/api/payments',()=>{})
app.use('/api/shipping',()=>{})
app.use('/api/reviews',()=>{})
app.use('/api/coupons',()=>{})


app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app