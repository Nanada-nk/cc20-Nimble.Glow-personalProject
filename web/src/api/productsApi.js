import axios from "axios"

const productsApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

productsApi.getAll = () => {
  return axios.get(`${BASE_URL}/products/`)
}

productsApi.getById = (id) => {
  return axios.get(`${BASE_URL}/products/${id}`)
}

productsApi.create = (body, token) => {
  return axios.post(`${BASE_URL}/products/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


productsApi.updateProduct = (id, body, token) => {
  return axios.patch(`${BASE_URL}/products/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

productsApi.deleteProduct = (id, token) => {
  return axios.delete(`${BASE_URL}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default productsApi