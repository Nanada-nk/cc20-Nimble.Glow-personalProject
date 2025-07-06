import axios from "axios"

const shippingApi = {}

const BASE_URL = 'http://localhost:9090/api/shipping'

shippingApi.getMethods = () => {
  return axios.get(`${BASE_URL}/methods`,)
}

shippingApi.getStatus = (id, token) => {
  return axios.get(`${BASE_URL}/orders/${id}/shipping`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


shippingApi.updateStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/orders/${id}/shipping`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default shippingApi