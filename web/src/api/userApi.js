import axios from "axios"

const userApi = {}

const BASE_URL = 'http://localhost:9090/api/users'

userApi.getListAllUser = (token) => {
  return axios.get(`${BASE_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.disableUser = (id, token) => {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


userApi.updateUserStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/status/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.updateMyProfile = (body, token) => {
  return axios.patch(`${BASE_URL}/profile/me`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.addMyAddress = (body, token) => {
  return axios.post(`${BASE_URL}/addresses`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.updateMyAddress = (id, body, token) => {
  return axios.patch(`${BASE_URL}/addresses/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.changeMyPassword = (body, token) => {
  return axios.patch(`${BASE_URL}/password/change`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}



export default userApi