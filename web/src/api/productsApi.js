import axios from "axios"

const productsApi = {}

const BASE_URL = 'http://localhost:9090/api/products'

productsApi.getAll = () => {
  return axios.get(`${BASE_URL}/`)
}

productsApi.getById = (id) => {
  return axios.get(`${BASE_URL}/${id}`)
}

productsApi.create = (body, token) => {
  return axios.post(`${BASE_URL}/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


productsApi.updateProduct = (id, body, token) => {
  return axios.patch(`${BASE_URL}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

productsApi.deleteProduct = (id, token) => {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default productsApi