import { proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const path = event.context.params?.path ?? ''
  const config = useRuntimeConfig(event)
  const backendBase = (config.apiBase as string).replace(/\/api$/, '')
  return proxyRequest(event, `${backendBase}/uploads/${path}`)
})
