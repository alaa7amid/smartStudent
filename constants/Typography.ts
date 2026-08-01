// Cairo — يدعم العربية واللاتينية بنفس العائلة (المنتج عربي أولاً، RTL).
// لا وزن Italic بـ Cairo (غير متوفر بـ Google Fonts، وغير مستخدم بالطباعة
// العربية أصلاً) — استُبدلت أي عناصر Italic بأقرب وزن غير مائل.
export const Typography = {
  'heading-lg': { fontFamily: 'Cairo_700Bold', fontSize: 22 },
  'heading-md': { fontFamily: 'Cairo_600SemiBold', fontSize: 18 },
  'heading-sm': { fontFamily: 'Cairo_600SemiBold', fontSize: 16 },
  body: { fontFamily: 'Cairo_400Regular', fontSize: 16 },
  'body-md': { fontFamily: 'Cairo_500Medium', fontSize: 16 },
  caption: { fontFamily: 'Cairo_400Regular', fontSize: 15 },
  'caption-sm': { fontFamily: 'Cairo_300Light', fontSize: 14 },
  micro: { fontFamily: 'Cairo_300Light', fontSize: 12 },
  'input-label': { fontFamily: 'Cairo_600SemiBold', fontSize: 14 },
} as const
