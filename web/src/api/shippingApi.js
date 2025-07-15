import axios from "axios"

const shippingApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

shippingApi.getMethods = (token) => {
  return axios.get(`${BASE_URL}/shipping/methods`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

shippingApi.getStatus = (orderId, token) => {
  return axios.get(`${BASE_URL}/shipping/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


shippingApi.updateShipping = (orderId, body, token) => {
  return axios.patch(`${BASE_URL}/shipping/orders/${orderId}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export default shippingApi