// babel-preset-expo يتضمّن تحويلات Expo Router (ربط expo-router/entry بمجلد app/).
// بدونه يفشل Metro في حلّ نقطة الدخول ويدوّر ./index — سبب الشاشة البيضاء.
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
  }
}
