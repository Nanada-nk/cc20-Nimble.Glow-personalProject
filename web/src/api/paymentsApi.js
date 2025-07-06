import axios from "axios"

const paymentsApi = {}

const BASE_URL = 'http://localhost:9090/api/payments'

paymentsApi.getMethods = () => {
  return axios.get(`${BASE_URL}/methods`,)
}


paymentsApi.payForOrder = (id, body, token) => {
  return axios.post(`${BASE_URL}/orders/${id}/pay`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

paymentsApi.getPaymentForOrder = (id, token) => {
  return axios.get(`${BASE_URL}/orders/${id}/payment`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

paymentsApi.refundPayment = (id, body, token) => {
  return axios.post(`${BASE_URL}/${id}/refund`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


paymentsApi.updatePaymentStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/${id}/status`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default paymentsApi