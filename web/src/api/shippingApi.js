import axios from "axios"

const shippingApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

shippingApi.getMethods = () => {
  return axios.get(`${BASE_URL}/shipping/methods`,)
}

shippingApi.getStatus = (orderId, token) => {
  return axios.get(`${BASE_URL}/shipping/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// // version 1
// shippingApi.updateStatus = (id, body, token) => {
//   return axios.patch(`${BASE_URL}/shipping/orders/${id}/shipping`, body, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
// }

shippingApi.updateShipping = (orderId, body, token) => {
  return axios.patch(`${BASE_URL}/shipping/orders/${orderId}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export default shippingApi