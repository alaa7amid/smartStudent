import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 60000, // توليد الاختبار قد ياخذ لين ~60 ثانية (NFR-1)
})
