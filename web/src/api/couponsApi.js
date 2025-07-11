import axios from "axios"

const couponsApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL



couponsApi.getAll = () => {
  return axios.get(`${BASE_URL}/coupons/`)
}

couponsApi.create = (body, token) => {
  return axios.post(`${BASE_URL}/coupons/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

couponsApi.update = (id, body, token) => {
  return axios.patch(`${BASE_URL}/coupons/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

couponsApi.delete = (id, token) => {
  return axios.delete(`${BASE_URL}/coupons/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

couponsApi.applyToOrder = (id, body, token) => {
  return axios.patch(`${BASE_URL}/coupons/apply/orders/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

couponsApi.getAvailableCoupons = (token) => {
    return axios.get(`${BASE_URL}/coupons/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default couponsApi