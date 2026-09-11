import axios, { AxiosInstance } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const AxiosImpl: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

AxiosImpl.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


let onNeedLogin: (() => void) | null = null
export const setNeedLoginHandler = (fn: () => void) => {
  onNeedLogin = fn
}

AxiosImpl.interceptors.response.use((response) => {
  if (response.status >= 200 && response.status < 400) {
    return response;
  } else {
    return Promise.reject(response)
  }
}, async (error) => {
  const errorCode = error.response?.data?.message?.code;

  if (errorCode == "token_not_valid") {
    try {
      // console.log("refresh token...")
      const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/token/refresh/`, {
        "refresh": getCookie("refresh_token")
      }).then(res => res.data)
      const newToken = result?.access || "";
      if (newToken) {
        setCookie("access_token", newToken)
      }
    } catch (error) {
      deleteCookie("access_token")
      deleteCookie("refresh_token")
      onNeedLogin?.()
      // window.location.href = "/login"
    }
  }

  return Promise.reject(error.response.data);
});


export default AxiosImpl 