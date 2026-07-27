export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        // Asegura que el enlace al manifiesto de la PWA esté siempre presente.
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@vercel/analytics'
  ],
  pwa: {
    registerType: 'prompt',
    manifest: {
      name: 'Asociación de Básquetbol Curanilahue',
      short_name: 'A.B.Chue',
      description: 'Plataforma oficial asociación de básquetbol de Curanilahue',
      theme_color: '#09090b', // Color de la barra de estado (zinc-950)
      background_color: '#09090b',
      start_url: '/',
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
          purpose: 'any'
        }
      ],
      screenshots: [
        {
          "src": "/screenshots/mobile-screenshot-1.png",
          "sizes": "540x720",
          "type": "image/png",
          "label": "Vista de la tabla de posiciones en móvil"
        },
        {
          "src": "/screenshots/desktop-screenshot-1.png",
          "sizes": "1280x720",
          "type": "image/png",
          "form_factor": "wide",
          "label": "Vista del centro de partidos en escritorio"
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
          // Usa StaleWhileRevalidate para los datos públicos, pero excluye las rutas de autenticación
          // para asegurar que siempre se obtenga el estado más reciente.
          urlPattern: ({ url }) => 
            url.pathname.startsWith('/api/') && 
            !url.pathname.startsWith('/api/auth/'),
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