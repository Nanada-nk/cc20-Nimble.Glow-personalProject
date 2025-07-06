import axios from "axios"

const reviewsApi = {}

const BASE_URL = 'http://localhost:9090/api/reviews'


reviewsApi.getByProduct = (id) => {
  return axios.get(`${BASE_URL}/product/${id}`)
}

reviewsApi.create = (id,body, token) => {
  return axios.post(`${BASE_URL}/product/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


reviewsApi.update = (id, body, token) => {
  return axios.patch(`${BASE_URL}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

reviewsApi.delete = (id, token) => {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default reviewsApi