export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt'
  ],
  pwa: {
    registerType: 'prompt',
    manifest: {
      name: 'Asociación de Básquetbol Curanilahue',
      short_name: 'ABC Curanilahue',
      description: 'Plataforma oficial del campeonato de básquetbol de Curanilahue',
      theme_color: '#09090b', // Color de la barra de estado (zinc-950)
      background_color: '#09090b',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'es-CL',
      icons: [
        {
          src: 'pwa-192x192.png', // Asegúrate de tener o colocar este ícono en la carpeta public/
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png', // Asegúrate de tener o colocar este ícono en la carpeta public/
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {      
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      // Estrategia para actualizar la PWA de forma proactiva:
      // Cuando hay una nueva versión, el Service Worker se activará inmediatamente
      // y tomará el control de la página. Esto hará que el aviso de "nueva versión"
      // aparezca sin que el usuario tenga que cerrar y volver a abrir la app.
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          // Estrategia para las peticiones a la API (posiciones, partidos, etc.)
          // Usa StaleWhileRevalidate: muestra el contenido cacheado al instante
          // y luego busca una nueva versión en segundo plano.
          urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-data-cache',
            expiration: {
              maxEntries: 100, // Número máximo de respuestas a cachear
              maxAgeSeconds: 60 * 60 * 24 // Cachear por 1 día (86400 segundos)
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true, // Permite probar la PWA en modo desarrollo local
      type: 'module'
    }
  }})