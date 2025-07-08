import axios from "axios"

const categoriesApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

categoriesApi.getAll = () => {
  return axios.get(`${BASE_URL}/categories/`)
}

categoriesApi.create = (body, token) => {
  return axios.post(`${BASE_URL}/categories/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


categoriesApi.updateCategory = (id, body, token) => {
  return axios.patch(`${BASE_URL}/categories/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

categoriesApi.deleteCategory = (id, token) => {
  return axios.delete(`${BASE_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default categoriesApi