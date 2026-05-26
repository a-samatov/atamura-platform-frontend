import { proxyRequest } from 'h3'

// Proxy all /api/* browser requests to the backend Fiber server.
// The runtime config apiBase already contains the full URL including /api,
// e.g. http://localhost:8080/api or http://backend:8080/api in Docker.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  // event.path = '/api/jobs?status=published' → strip /api prefix
  const rest = event.path.replace(/^\/api/, '')
  return proxyRequest(event, `${config.apiBase}${rest}`)
})
