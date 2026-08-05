<template>
  <div class="min-h-[100dvh] bg-zinc-950 pb-20 pt-24 px-4 relative overflow-hidden">
    <!-- Decoración de fondo -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="max-w-[1000px] mx-auto relative z-10">
      
      <!-- Encabezado -->
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-black tracking-widest uppercase mb-4">
          <svg class="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Documento Oficial
        </div>
        <h1 class="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tighter">
          Bases y <span class="text-amber-500">Reglamento</span>
        </h1>
        <p class="text-zinc-400 mt-4 font-medium max-w-xl leading-relaxed">
          Normativas, categorías, sistema de puntuación y régimen disciplinario que rigen el Campeonato 2026 de la Asociación de Básquetbol de Curanilahue.
        </p>
      </div>

      <!-- Tarjeta de Acción (Mobile First) -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mb-8">
        <div class="flex items-center gap-5 w-full sm:w-auto">
          <div class="w-16 h-16 bg-zinc-950 border border-zinc-700 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h3 class="text-zinc-100 font-black uppercase tracking-wider text-lg">BASES_2026.PDF</h3>
            <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Formato PDF • 1.2 MB</p>
          </div>
        </div>
        
        <!-- Botón para abrir/descargar el documento -->
        <a 
          :href="urlReglamento" 
          target="_blank" 
          rel="noopener noreferrer"
          class="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-zinc-950 font-black uppercase tracking-widest px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Leer Documento
        </a>
      </div>

      <!-- Visor Integrado (Solo visible en pantallas medianas o grandes) -->
      <div class="hidden md:block w-full h-[800px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        </div>
        <object 
          :data="urlReglamento" 
          type="application/pdf" 
          class="w-full h-full relative z-10"
        >
          <p class="p-8 text-center text-zinc-400">
            Tu navegador no soporta la visualización de PDFs. 
            <a :href="urlReglamento" class="text-amber-500 underline">Descárgalo aquí</a>.
          </p>
        </object>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// REEMPLAZA ESTA URL CON LA QUE COPIASTE DE SUPABASE STORAGE
const urlReglamento = 'https://iypmxiqncpmojobrfeyr.supabase.co/storage/v1/object/public/documentos/Bases2026.pdf'
</script>