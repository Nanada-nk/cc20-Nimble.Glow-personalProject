import axios from "axios"

const cartApi = {}

const BASE_URL = 'http://localhost:9090/api/cart'

cartApi.getCart = (token) => {
  return axios.get(`${BASE_URL}/`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
  )
}


cartApi.addItemToCart = (body, token) => {
  return axios.post(`${BASE_URL}/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


cartApi.removeItem = (id, token) => {
  return axios.delete(`${BASE_URL}/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default cartApi