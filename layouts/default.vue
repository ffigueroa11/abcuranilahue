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
            <NuxtLink to="/transmisiones" class="text-zinc-400 hover:text-zinc-100 hover:border-b-2 hover:border-red-800 pb-1 transition-all">Transmisiones</NuxtLink>
            <!-- <NuxtLink to="/noticias" class="text-zinc-400 hover:text-zinc-100 hover:border-b-2 hover:border-zinc-400 pb-1 transition-all">Noticias</NuxtLink> -->
            
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
          <!-- <NuxtLink to="/noticias" @click="isMobileMenuOpen = false" class="text-zinc-100 hover:text-amber-500 transition-colors">Noticias</NuxtLink> -->
          <NuxtLink to="/transmisiones" @click="isMobileMenuOpen = false" class="text-zinc-100 hover:text-amber-500 transition-colors">Transmisiones</NuxtLink>
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
          <p class="text-zinc-400">asoc.basquet.chue@gmail.com</p>
          <div class="mt-4 flex gap-4">
            <!-- Enlace Directo a Instagram -->
            <a 
              href="https://www.instagram.com/asoc.basquetbol.chue" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-amber-500 hover:bg-zinc-800 text-zinc-400 hover:text-amber-500 transition-all group"
              title="Síguenos en Instagram"
            >
              <!-- Icono SVG de Instagram -->
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <!-- Mantuvimos o puedes agregar el de YouTube también si gustas -->
            <a 
              href="https://youtube.com/@asociaciondebasquetbolchue?si=KsmXHkJTZfpwKG75" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-red-600 hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-all"
              title="Canal de YouTube"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
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