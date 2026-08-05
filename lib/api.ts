import axios from 'axios'

export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 60000, // توليد الاختبار قد ياخذ لين ~60 ثانية (NFR-1)
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 على طلب مصادَق عليه = الجلسة انتهت أو التوكن غير صالح — نخرّج الطالب.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)
