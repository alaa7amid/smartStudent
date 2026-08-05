import { api } from '@/lib/api'
import type { AuthStudent } from '@/store/auth-store'

export interface RequestOtpResponse {
  status: 'sent' | 'invalid_phone' | 'failed'
  channel?: 'mock' | 'whatsapp' | 'sms'
  devCode?: string // موجود فقط بوضع MOCK_OTP بالباك اند — للتطوير حصراً
  message?: string
}

export interface VerifyOtpSuccess {
  status: 'ok'
  token: string
  student: AuthStudent
}

export interface VerifyOtpFailure {
  status: 'incorrect_code' | 'too_many_attempts' | 'expired' | 'invalid_input' | 'failed'
  message: string
}

export type VerifyOtpResponse = VerifyOtpSuccess | VerifyOtpFailure

// FR-1 — يرسل كود OTP لرقم الطالب.
export async function requestOtp(phone: string): Promise<RequestOtpResponse> {
  const { data } = await api.post<RequestOtpResponse>('/auth/otp/request', { phone })
  return data
}

// FR-1 — يتحقق من الكود ويرجّع الجلسة (توكن + بيانات الطالب) عند النجاح.
export async function verifyOtp(phone: string, code: string): Promise<VerifyOtpResponse> {
  const { data } = await api.post<VerifyOtpResponse>('/auth/otp/verify', { phone, code })
  return data
}
