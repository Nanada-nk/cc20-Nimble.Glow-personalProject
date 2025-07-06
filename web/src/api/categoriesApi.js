import axios from "axios"

const categoriesApi = {}

const BASE_URL = 'http://localhost:9090/api/categories'

categoriesApi.getAll = () => {
  return axios.get(`${BASE_URL}/`)
}

categoriesApi.create = (body, token) => {
  return axios.post(`${BASE_URL}/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


categoriesApi.updateCategory = (id, body, token) => {
  return axios.patch(`${BASE_URL}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

categoriesApi.deleteCategory = (id, token) => {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default categoriesApi