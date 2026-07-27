import type { PwaInjection } from '@vite-pwa/nuxt'

// Este archivo de declaración le dice a TypeScript qué es el objeto `$pwa`.

// Augmenta el módulo #app de Nuxt
declare module '#app' {
  interface NuxtApp {
    $pwa: PwaInjection
  }
}

// Augmenta las propiedades de los componentes de Vue
declare module 'vue' {
  interface ComponentCustomProperties {
    $pwa: PwaInjection
  }
}

export {}