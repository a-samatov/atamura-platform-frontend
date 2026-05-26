export function useSiteUrl(): string {
  return useRuntimeConfig().public.siteUrl as string
}
