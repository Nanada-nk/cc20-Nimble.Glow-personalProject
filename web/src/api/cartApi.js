import axios from "axios"

const cartApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

cartApi.getCart = (token) => {
  return axios.get(`${BASE_URL}/cart/`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
  )
}


cartApi.addItemToCart = (body, token) => {
  return axios.post(`${BASE_URL}/cart/`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


cartApi.removeItem = (id, token) => {
  return axios.delete(`${BASE_URL}/cart/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default cartApi