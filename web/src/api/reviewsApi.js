import axios from "axios"

const reviewsApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL


reviewsApi.getByProduct = (id) => {
  return axios.get(`${BASE_URL}/reviews/product/${id}`)
}

reviewsApi.create = (id,body, token) => {
  return axios.post(`${BASE_URL}/reviews/product/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


reviewsApi.update = (id, body, token) => {
  return axios.patch(`${BASE_URL}/reviews/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

reviewsApi.delete = (id, token) => {
  return axios.delete(`${BASE_URL}/reviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default reviewsApi