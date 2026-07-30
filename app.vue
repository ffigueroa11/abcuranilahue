<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Componentes PWA solo se renderizan en el cliente -->

    <ClientOnly>
      <AvisoInstagram />
      <PwaReloadPrompt />
      <InstallPwa />
    </ClientOnly>
    <BannerNotificaciones />
  </div>
</template>