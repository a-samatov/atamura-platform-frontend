import { nextTick } from 'vue'

export const PHONE_MIN_DIGITS = 7
export const PHONE_MAX_DIGITS = 15

export type PhoneErrorCode = '' | 'phone_required' | 'phone_too_short' | 'phone_too_long'

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, PHONE_MAX_DIGITS)
  if (!digits.length) return ''
  const ccLen = digits.length <= 11 ? 1 : digits.length <= 12 ? 2 : 3
  const cc   = digits.slice(0, ccLen)
  const rest = digits.slice(ccLen)
  let out = '+' + cc
  if (!rest.length) return out
  const area = rest.slice(0, 3)
  out += ' (' + area
  if (rest.length <= 3) return out
  const p1 = rest.slice(3, 6)
  out += ') ' + p1
  if (rest.length <= 6) return out
  const p2 = rest.slice(6, 8)
  out += '-' + p2
  if (rest.length <= 8) return out
  out += '-' + rest.slice(8)
  return out
}

export function usePhoneMask(phoneRef: Ref<string>) {
  function handlePhoneInput(e: Event) {
    const input = e.target as HTMLInputElement
    const formatted = formatPhone(input.value)
    phoneRef.value = formatted
    nextTick(() => input.setSelectionRange(formatted.length, formatted.length))
  }

  function handlePhoneKeypress(e: KeyboardEvent) {
    if (!/[\d+]/.test(e.key)) e.preventDefault()
  }

  function handlePhoneKeydown(e: KeyboardEvent) {
    if (e.key !== 'Backspace') return
    const input = e.target as HTMLInputElement
    const pos = input.selectionStart ?? input.value.length
    if (pos === 0) return
    const charBefore = input.value[pos - 1]
    if (/[\s()\-+]/.test(charBefore)) {
      e.preventDefault()
      const before = input.value.slice(0, pos - 1)
      const after  = input.value.slice(pos)
      const newDigits = before.replace(/\D/g, '').slice(0, -1) + after.replace(/\D/g, '')
      const formatted = formatPhone(newDigits)
      phoneRef.value = formatted
      nextTick(() => input.setSelectionRange(formatted.length, formatted.length))
    }
  }

  function validatePhone(): PhoneErrorCode {
    const digits = phoneRef.value.replace(/\D/g, '')
    if (!digits.length) return 'phone_required'
    if (digits.length < PHONE_MIN_DIGITS) return 'phone_too_short'
    if (digits.length > PHONE_MAX_DIGITS) return 'phone_too_long'
    return ''
  }

  return { handlePhoneInput, handlePhoneKeypress, handlePhoneKeydown, validatePhone }
}
