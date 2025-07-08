import axios from "axios"

const authApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

authApi.register = (body) => {
  return axios.post(`${BASE_URL}/auth/register`, body)
}

authApi.login = (body) => {
  return axios.post(`${BASE_URL}/auth/login`, body)
}


authApi.getMe = (token) => {
  return axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

authApi.forgotPassword = (body) => {
  return axios.post(`${BASE_URL}/auth/forgot-password`, body)
}

authApi.resetPassword = (body) => {
  return axios.post(`${BASE_URL}/auth/reset-password`, body)
}


export default authApi