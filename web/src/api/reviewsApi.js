import axios from "axios"

const reviewsApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL


reviewsApi.getAllReviews = (token) => {
  return axios.get(`${BASE_URL}/reviews`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

reviewsApi.getByProduct = (id) => {
  return axios.get(`${BASE_URL}/reviews/product/${id}`)
}

reviewsApi.create = (productId, formData, token) => {
  return axios.post(`${BASE_URL}/reviews/product/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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



export default reviewsApi