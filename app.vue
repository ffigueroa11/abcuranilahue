<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Componentes PWA solo se renderizan en el cliente -->
    <ClientOnly>
      <PwaReloadPrompt />
      <InstallPwa />
    </ClientOnly>
  </div>
</template>