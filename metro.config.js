// إعداد Metro الافتراضي من Expo. مطلوب حتى يتعرّف Metro على مشروع expo-router
// ويستخدم expo-router/entry نقطةَ دخول بدل البحث عن ./index في الجذر.
const { getDefaultConfig } = require('expo/metro-config')
const { createProxyMiddleware } = require('http-proxy-middleware')

const config = getDefaultConfig(__dirname)

// بروكسي تطوير: نمرّر أي طلب يبدأ بـ /quiz إلى الباك-إند المحلي (منفذ 3000).
// السبب: راوتر المستخدم يعزل الأجهزة، فنشغّل Expo عبر tunnel واحد؛ وبدل فتح
// نفق ثاني للباك-إند (ngrok المجّاني يسمح بنفق واحد)، نمرّر طلبات الـ API عبر
// سيرفر Metro نفسه — فيصل الآيفون للفرونت والـ API معاً برابط واحد.
const quizProxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
})

const originalEnhance = config.server.enhanceMiddleware

config.server.enhanceMiddleware = (metroMiddleware, server) => {
  const base = originalEnhance
    ? originalEnhance(metroMiddleware, server)
    : metroMiddleware

  return (req, res, next) => {
    if (req.url && req.url.startsWith('/quiz')) {
      return quizProxy(req, res, next)
    }
    return base(req, res, next)
  }
}

module.exports = config
