import axios from "axios"

const ordersApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

ordersApi.getUserOrders = (token) => {
  return axios.get(`${BASE_URL}/orders/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  )
}


ordersApi.createOrder = (body, token) => {
  return axios.post(`${BASE_URL}/orders/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

ordersApi.getOrderById = (id, token) => {
  return axios.get(`${BASE_URL}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  )
}

ordersApi.getAllAdminOrders = (token) => {
  return axios.get(`${BASE_URL}/orders/admin`, { 
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

ordersApi.updateStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/orders/${id}/status`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default ordersApi