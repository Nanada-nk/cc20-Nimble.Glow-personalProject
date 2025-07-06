import axios from "axios"

const ordersApi = {}

const BASE_URL = 'http://localhost:9090/api/orders'

ordersApi.getUserOrders = (token) => {
  return axios.get(`${BASE_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  )
}


ordersApi.createOrder = (body, token) => {
  return axios.post(`${BASE_URL}/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

ordersApi.getOrderById = (id, token) => {
  return axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  )
}


ordersApi.updateStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/${id}/status`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default ordersApi