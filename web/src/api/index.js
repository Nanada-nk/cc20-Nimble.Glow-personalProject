// src/api/index.js
import authApi from './authApi';
import cartApi from './cartApi';
import categoriesApi from './categoriesApi';
import couponsApi from './couponsApi';
import ordersApi from './ordersApi';
import paymentsApi from './paymentsApi';
import productsApi from './productsApi';
import reviewsApi from './reviewsApi';
import shippingApi from './shippingApi';
import userApi from './userApi';

const api = {
  auth: authApi,
  cart: cartApi,
  categories: categoriesApi,
  coupons: couponsApi,
  orders: ordersApi,
  payments: paymentsApi,
  products: productsApi,
  reviews: reviewsApi,
  shipping: shippingApi,
  user: userApi,
};

export default api;