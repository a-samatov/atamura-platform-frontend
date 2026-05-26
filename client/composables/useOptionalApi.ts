export async function useOptionalApi<T>(
  url: string,
  timeout = 5000
): Promise<T | null> {
  const base = useApiBase()
  // url arrives as /api/something — strip /api since base already ends with /api
  const path = url.replace(/^\/api/, '')
  const fullUrl = base + path

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    return await $fetch<T>(fullUrl, { signal: controller.signal })
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
