import axios from "axios"

const userApi = {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

userApi.getListAllUser = (token) => {
  return axios.get(`${BASE_URL}/users/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.disableUser = (id, token) => {
  return axios.delete(`${BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


userApi.updateUserStatus = (id, body, token) => {
  return axios.patch(`${BASE_URL}/users/status/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.updateMyProfile = (formData, token) => {
  return axios.patch(`${BASE_URL}/users/profile/me`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.getMyAddresses = (token) => {
  return axios.get(`${BASE_URL}/users/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

userApi.addMyAddress = (body, token) => {
  return axios.post(`${BASE_URL}/users/addresses`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.updateMyAddress = (id, body, token) => {
  return axios.patch(`${BASE_URL}/users/addresses/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.changeMyPassword = (body, token) => {
  return axios.patch(`${BASE_URL}/users/password/change`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

userApi.deleteAddress = (addressId, token) => {
  return axios.delete(`${BASE_URL}/users/addresses/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}



export default userApi