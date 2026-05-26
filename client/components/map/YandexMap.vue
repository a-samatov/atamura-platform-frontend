<template>
  <div
    ref="mapContainer"
    :style="{ width: '100%', height: height, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }"
  />
</template>

<script setup lang="ts">
interface Marker {
  lat: number
  lng: number
  title: string
  description?: string
}

const props = withDefaults(defineProps<{
  markers?: Marker[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
}>(), {
  markers: () => [],
  center: () => ({ lat: 43.238949, lng: 76.889709 }),
  zoom: 11,
  height: '480px',
})

const config = useRuntimeConfig()
const mapContainer = ref<HTMLElement | null>(null)
const YANDEX_API_KEY = config.public.yandexApiKey

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any

// Resolves only when ymaps is fully initialised and ready to use.
function loadYandexMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    const onReady = () => w.ymaps.ready(resolve)

    if (w.ymaps) { onReady(); return }

    if (document.getElementById('yandex-maps-script')) {
      const wait = setInterval(() => {
        if (w.ymaps) { clearInterval(wait); onReady() }
      }, 100)
      return
    }

    const script = document.createElement('script')
    script.id = 'yandex-maps-script'
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=ru_RU`
    script.onload  = onReady
    script.onerror = () => reject(new Error('Yandex Maps failed to load'))
    document.head.appendChild(script)
  })
}

let mapInstance: any = null

onMounted(async () => {
  if (!mapContainer.value) return
  try {
    await loadYandexMaps()
    // Guard: component may have been unmounted while the script was loading.
    if (!mapContainer.value) return

    mapInstance = new w.ymaps.Map(mapContainer.value, {
      center: [props.center.lat, props.center.lng],
      zoom: props.zoom,
      controls: ['zoomControl', 'typeSelector'],
    })

    for (const m of props.markers) {
      const placemark = new w.ymaps.Placemark(
        [m.lat, m.lng],
        {
          balloonContentHeader: m.title,
          balloonContentBody: m.description ?? '',
          hintContent: m.title,
        },
        { preset: 'islands#blueDotIcon' }
      )
      mapInstance.geoObjects.add(placemark)
    }
  } catch (e) {
    console.error('YandexMap init error:', e)
  }
})

onUnmounted(() => {
  mapInstance?.destroy()
  mapInstance = null
})
</script>