export function useScrollReveal(containerRef?: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const root = containerRef?.value ?? document
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -48px 0px' }
    )
    root.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(
      (el) => observer!.observe(el)
    )
  })

  onUnmounted(() => observer?.disconnect())
}
