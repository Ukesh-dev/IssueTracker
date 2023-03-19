import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

const axiosParams = {
  baseURL: "/",
  // process.env.Node_ENV === "developement" ? "http://127.0.0.1:5173" : "/",
}

const axiosInstance = axios.create(axiosParams)

const api = (axios: AxiosInstance) => ({
  get: <T>(url: string, config: AxiosRequestConfig = {}) =>
    axios.get<T>(url, config),
  post: <T>(url: string, body: unknown, config: AxiosRequestConfig) =>
    axios.post<T>(url, body, config),
})

export default api(axiosInstance)
