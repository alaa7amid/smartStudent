import axios from 'axios'
import Constants from 'expo-constants'

// في التطوير عبر نفق/شبكة، طلبات الـ API تمرّ عبر سيرفر Metro نفسه (بروكسي
// في metro.config.js يوجّه /quiz إلى الباك-إند على منفذ 3000). فنبني الـ
// baseURL من نفس مضيف Metro الذي حمّل التطبيق — يشتغل مع أي رابط نفق يتغيّر
// تلقائياً، ويتجاوز عزل الأجهزة في الراوتر. في الإنتاج نستخدم المتغيّر البيئي.
function resolveBaseURL(): string | undefined {
  const explicit = process.env.EXPO_PUBLIC_API_URL
  const hostUri = Constants.expoConfig?.hostUri

  if (__DEV__ && hostUri) {
    // hostUri قد يكون host:port (LAN) أو دومين نفق. نحافظ على البروتوكول:
    // النفق https، والشبكة المحلية http.
    const scheme = hostUri.includes('.exp.direct') ? 'https' : 'http'
    return `${scheme}://${hostUri}`
  }

  return explicit
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 60000, // توليد الاختبار قد ياخذ لين ~60 ثانية (NFR-1)
})
