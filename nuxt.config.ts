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
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true, // Permite probar la PWA en modo desarrollo local
      type: 'module'
    }
  }})