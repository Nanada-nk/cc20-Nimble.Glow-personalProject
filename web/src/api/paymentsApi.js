import axios from "axios"

const paymentsApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

paymentsApi.getMethods = () => {
  return axios.get(`${BASE_URL}/payments/methods`,)
}

paymentsApi.uploadSlip = (paymentId, formData, token) => {

  return axios.post(`${BASE_URL}/payments/${paymentId}/slip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
}


paymentsApi.payForOrder = (id, body, token) => {
  return axios.post(`${BASE_URL}/payments/orders/${id}/pay`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

paymentsApi.getPaymentForOrder = (id, token) => {
  return axios.get(`${BASE_URL}/payments/orders/${id}/payment`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

paymentsApi.refundPayment = (id, body, token) => {
  return axios.post(`${BASE_URL}/payments/${id}/refund`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


paymentsApi.updatePaymentStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/payments/${id}/status`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default paymentsApi