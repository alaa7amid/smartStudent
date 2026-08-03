// نفق تطوير يعرّض السيرفر المحلي (منفذ 3000) على رابط عام
// حتى يوصله الجوال الحقيقي عبر Expo Go. للتطوير فقط.
import { connect } from '@expo/ngrok'

const url = await connect({ addr: 3000 })
console.log('TUNNEL_URL=' + url)
setInterval(() => {}, 1 << 30)
