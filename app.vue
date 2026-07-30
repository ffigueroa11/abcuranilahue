<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Componentes PWA solo se renderizan en el cliente -->
    <AvisoInstagram />
    <ClientOnly>      
      <PwaReloadPrompt />
      <InstallPwa />
    </ClientOnly>
    <BannerNotificaciones />
    <NavegacionMovil />
  </div>
</template>