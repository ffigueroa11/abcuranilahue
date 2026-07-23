<script setup lang="ts">
const isMobileMenuOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-600 selection:text-white">
    <!-- Navbar Premium ABC -->
    <nav class="bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-24">
          
          <!-- Logo Oficial ABC -->
          <NuxtLink to="/" @click="isMobileMenuOpen = false" class="flex-shrink-0 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity z-50">
            <img src="~/assets/ABC_TRANSPARENTE.png" alt="Logo ABC" class="h-16 w-auto drop-shadow-2xl" />
          </NuxtLink>
          
          <!-- Menú Desktop -->
          <div class="hidden lg:flex space-x-8 text-[13px] font-bold uppercase tracking-widest items-center">
            <NuxtLink to="/" class="text-amber-500 border-b-2 border-amber-500 pb-1">Inicio</NuxtLink>
            <NuxtLink to="/posiciones" class="text-zinc-400 hover:text-zinc-100 hover:border-b-2 hover:border-red-800 pb-1 transition-all">Posiciones</NuxtLink>
            <NuxtLink to="/partidos" class="text-zinc-400 hover:text-zinc-100 hover:border-b-2 hover:border-blue-700 pb-1 transition-all">Partidos</NuxtLink>
            <NuxtLink to="/equipos" class="text-zinc-400 hover:text-zinc-100 hover:border-b-2 hover:border-zinc-400 pb-1 transition-all">Equipos</NuxtLink>
            <NuxtLink to="/noticias" class="text-zinc-400 hover:text-zinc-100 hover:border-b-2 hover:border-zinc-400 pb-1 transition-all">Noticias</NuxtLink>
            
            <div class="h-6 w-px bg-zinc-800 mx-2"></div>
            
            <button class="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 border border-red-700 text-white px-6 py-2.5 rounded shadow-[0_0_15px_rgba(139,0,0,0.4)] font-black text-xs uppercase transition-all">
              Intranet Clubes
            </button>
          </div>

          <!-- Botón Menú Móvil -->
          <div class="lg:hidden flex items-center">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-amber-500 focus:outline-none z-50">
              <svg v-if="!isMobileMenuOpen" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menú Móvil (desplegable) -->
      <div v-if="isMobileMenuOpen" class="lg:hidden bg-zinc-950/95 backdrop-blur-lg absolute top-0 left-0 w-full h-screen pt-24">
        <div class="flex flex-col items-center justify-center h-full space-y-8 text-lg font-bold uppercase tracking-widest -mt-24">
          <NuxtLink to="/" @click="isMobileMenuOpen = false" class="text-zinc-100 hover:text-amber-500 transition-colors">Inicio</NuxtLink>
          <NuxtLink to="/posiciones" @click="isMobileMenuOpen = false" class="text-zinc-100 hover:text-amber-500 transition-colors">Posiciones</NuxtLink>
          <NuxtLink to="/partidos" @click="isMobileMenuOpen = false" class="text-zinc-100 hover:text-amber-500 transition-colors">Partidos</NuxtLink>
          <NuxtLink to="/equipos" @click="isMobileMenuOpen = false" class="text-zinc-100 hover:text-amber-500 transition-colors">Equipos</NuxtLink>
          <NuxtLink to="/noticias" @click="isMobileMenuOpen = false" class="text-zinc-100 hover:text-amber-500 transition-colors">Noticias</NuxtLink>
          <button class="mt-8 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 text-white px-8 py-3 rounded shadow-[0_0_15px_rgba(139,0,0,0.4)] font-black text-sm uppercase">
            Intranet Clubes
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenido -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 mt-20 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950 z-0"></div>
      <div class="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-sm relative z-10">
        <div>
          <img src="~/assets/ABC_TRANSPARENTE.png" alt="Logo ABC" class="h-16 w-auto mb-6 grayscale hover:grayscale-0 transition-all duration-500" />
          <p class="text-zinc-500 leading-relaxed">Asociación de Básquetbol Curanilahue. Fomentando el deporte y la disciplina en la Provincia de Arauco.</p>
        </div>
        <div>
          <h3 class="text-zinc-100 font-black uppercase mb-4 tracking-widest border-l-2 border-amber-600 pl-2">Competición</h3>
          <ul class="space-y-3 text-zinc-400">
            <li><NuxtLink to="/equipos" class="hover:text-amber-500 transition-colors">Equipos Participantes</NuxtLink></li>
            <li><NuxtLink to="/documentos/bases" class="hover:text-amber-500 transition-colors">Bases del Campeonato</NuxtLink></li>
            <li><NuxtLink to="/documentos/tribunal" class="hover:text-amber-500 transition-colors">Tribunal de Disciplina</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-zinc-100 font-black uppercase mb-4 tracking-widest border-l-2 border-red-800 pl-2">Media</h3>
          <ul class="space-y-3 text-zinc-400">
            <li><NuxtLink to="/galeria" class="hover:text-amber-500 transition-colors">Galería de Fotos</NuxtLink></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="hover:text-amber-500 transition-colors">Transmisiones (YouTube)</a></li>
            <li><NuxtLink to="/noticias" class="hover:text-amber-500 transition-colors">Noticias</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-zinc-100 font-black uppercase mb-4 tracking-widest border-l-2 border-blue-700 pl-2">Contacto</h3>
          <p class="text-zinc-400">gimnasio@abcuranilahue.cl</p>
          <div class="mt-4 flex gap-4">
            <!-- Iconos sociales placeholder -->
            <div class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-amber-600 cursor-pointer transition-colors">IG</div>
            <div class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-red-600 cursor-pointer transition-colors">YT</div>
          </div>
        </div>
      </div>
      <div class="max-w-[1400px] mx-auto px-4 border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-600 relative z-10">
        <p>© 2026 ABCuranilahue. Todos los derechos reservados.</p>
        <p class="mt-2 sm:mt-0">Desarrollo Plataforma Deportiva</p>
      </div>
    </footer>
  </div>
</template>