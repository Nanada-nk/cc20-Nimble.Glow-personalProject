import axios from "axios"

const authApi = {}

const BASE_URL = 'http://localhost:9090/api/auth'

authApi.register = (body) => {
  return axios.post(`${BASE_URL}/register`, body)
}

authApi.login = (body) => {
  return axios.post(`${BASE_URL}/login`, body)
}


authApi.getMe = (body, token) => {
  return axios.get(`${BASE_URL}/me`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

authApi.forgotPassword = (body) => {
  return axios.post(`${BASE_URL}/forgot-password`, body)
}

authApi.resetPassword = (body) => {
  return axios.post(`${BASE_URL}/reset-password`, body)
}



export default authApi