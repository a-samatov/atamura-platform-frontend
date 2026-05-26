export function useApiBase(): string {
  const config = useRuntimeConfig()
  return import.meta.server ? (config.apiBase as string) : config.public.apiBase
}
