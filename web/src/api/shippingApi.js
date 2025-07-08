import axios from "axios"

const shippingApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

shippingApi.getMethods = () => {
  return axios.get(`${BASE_URL}/shipping/methods`,)
}

shippingApi.getStatus = (id, token) => {
  return axios.get(`${BASE_URL}/shipping/orders/${id}/shipping`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


shippingApi.updateStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/shipping/orders/${id}/shipping`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default shippingApi