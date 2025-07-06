import axios from "axios"

const couponsApi = {}

const BASE_URL = 'http://localhost:9090/api/coupons'


couponsApi.getByProduct = () => {
  return axios.get(`${BASE_URL}/`)
}

couponsApi.create = (body, token) => {
  return axios.post(`${BASE_URL}/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


couponsApi.applyToOrder = (id, body, token) => {
  return axios.patch(`${BASE_URL}/apply/orders/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


export default couponsApi