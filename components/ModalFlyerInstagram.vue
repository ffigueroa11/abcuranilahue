<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 flex flex-col max-h-[95vh] relative">
      
      <!-- Botón Cerrar -->
      <button @click="$emit('update:modelValue', false)" class="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-950 border border-zinc-800 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div class="mb-4">
        <h3 class="text-lg font-black text-white uppercase tracking-tight">Generar Flyer de Instagram</h3>
        <p class="text-xs text-zinc-400">Previsualiza y descarga la gráfica oficial para historias.</p>
      </div>

      <!-- CONTENEDOR DE VISTA PREVIA (Escalado responsivo sin desbordar Flexbox) -->
      <div class="flex-1 overflow-y-auto flex justify-center items-start bg-zinc-950 rounded-xl p-4 sm:p-6 border border-zinc-800">
        
        <!-- Contenedor que reserva el espacio FÍSICO exacto (25% de 1080x1920) -->
        <div class="w-[270px] h-[480px] relative shrink-0 my-auto">
          
          <!-- Contenedor que aplica la escala desde la esquina superior izquierda -->
          <div class="absolute top-0 left-0 origin-top-left transform scale-[0.25]">
            
            <!-- CANVAS VIRTUAL PARA INSTAGRAM (1080px x 1920px) -->
            <div 
              ref="flyerRef" 
              class="w-[1080px] h-[1920px] bg-zinc-950 text-white p-16 flex flex-col justify-between relative overflow-hidden font-sans border-4 border-amber-500/30"
              style="background-image: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15), transparent 70%);"
            >
              <!-- Adornos de fondo -->
              <div class="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
              <div class="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

              
              <!-- LISTA DE PARTIDOS ORDENADOS CHRONOLÓGICAMENTE -->
              <div class="relative z-10 flex-1 my-10 flex flex-col justify-center gap-6">
                <div 
                  v-for="partido in partidosOrdenados" 
                  :key="partido.id" 
                  class="bg-zinc-900/90 border-2 border-zinc-800 rounded-3xl p-6 flex items-center justify-between shadow-2xl relative overflow-hidden"
                >
                  <!-- Franja de Categoría -->
                  <div class="absolute top-0 left-0 right-0 bg-zinc-800/80 px-6 py-1.5 flex justify-between items-center border-b border-zinc-700/50">
                    <span class="text-lg font-black text-amber-500 uppercase tracking-widest">
                      {{ partido.categoria?.nombre || 'CATEGORÍA' }}
                    </span>
                    <span class="text-base font-bold text-zinc-400 uppercase tracking-wider">
                      {{ formatHora(partido.fecha_hora) }} HRS
                    </span>
                  </div>

                  <!-- Enfrentamiento -->
                  <div class="w-full flex items-center justify-between mt-8 px-4">
                    <!-- Equipo Local -->
                    <div class="flex flex-col items-center gap-3 w-5/12 text-center">
                      <div class="w-24 h-24 bg-zinc-950 rounded-full border-2 border-zinc-700 flex items-center justify-center p-2 shadow-inner">
                        <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-contain" />
                        <span v-else class="text-3xl font-black text-zinc-500">{{ partido.local.nombre.charAt(0) }}</span>
                      </div>
                      <span class="text-xl font-black uppercase text-zinc-100 leading-tight line-clamp-2">
                        {{ partido.local.nombre }}
                      </span>
                    </div>

                    <!-- Centro: VS o Marcador -->
                    <div class="w-2/12 flex flex-col items-center justify-center">
                      <template v-if="esResultados">
                        <div class="bg-zinc-950 border-2 border-amber-500/50 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                          <span class="text-4xl font-black text-amber-500">{{ partido.score_local ?? 0 }}</span>
                          <span class="text-2xl text-zinc-600 font-bold">-</span>
                          <span class="text-4xl font-black text-zinc-100">{{ partido.score_visita ?? 0 }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <span class="text-3xl font-black text-zinc-600 bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800">VS</span>
                      </template>
                    </div>

                    <!-- Equipo Visita -->
                    <div class="flex flex-col items-center gap-3 w-5/12 text-center">
                      <div class="w-24 h-24 bg-zinc-950 rounded-full border-2 border-zinc-700 flex items-center justify-center p-2 shadow-inner">
                        <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-contain" />
                        <span v-else class="text-3xl font-black text-zinc-500">{{ partido.visita.nombre.charAt(0) }}</span>
                      </div>
                      <span class="text-xl font-black uppercase text-zinc-100 leading-tight line-clamp-2">
                        {{ partido.visita.nombre }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              

            </div>
          </div>
        </div>
      </div>

      <!-- BOTÓN DE DESCARGA -->
      <div class="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
        <button 
          @click="descargarFlyer" 
          :disabled="generando"
          class="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg v-if="generando" class="animate-spin w-5 h-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ generando ? 'Generando PNG...' : 'Descargar Imagen HD' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toPng } from 'html-to-image'

const props = defineProps<{
  modelValue: boolean
  grupo: {
    titulo: string
    partidos: any[]
  }
  esResultados?: boolean
}>()

defineEmits(['update:modelValue'])

const flyerRef = ref<HTMLElement | null>(null)
const generando = ref(false)

const fechaTitulo = computed(() => props.grupo?.titulo || 'FECHA OFICIAL')

// ORDENAR PARTIDOS CHRONOLÓGICAMENTE
const partidosOrdenados = computed(() => {
  if (!props.grupo?.partidos) return []
  return [...props.grupo.partidos].sort((a, b) => {
    return new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
  })
})

const formatHora = (fecha: string | Date) => {
  if (!fecha) return '00:00'
  const dateObj = new Date(fecha)
  return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`
}

// LÓGICA DE GENERACIÓN Y DESCARGA EN ALTA RESOLUCIÓN
const descargarFlyer = async () => {
  if (!flyerRef.value) return
  generando.value = true

  try {
    // Generamos la imagen con pixelRatio x2 para resolución ultra nítida en Instagram
    const dataUrl = await toPng(flyerRef.value, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
    })

    const link = document.createElement('a')
    const nombreLimpio = fechaTitulo.value.toLowerCase().replace(/[^a-z0-0]/g, '_')
    const tipo = props.esResultados ? 'resultados' : 'programacion'
    
    link.download = `instagram_${tipo}_${nombreLimpio}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Error al generar la imagen de Instagram:', error)
    alert('Ocurrió un error al generar la imagen. Asegúrate de que los logos carguen correctamente.')
  } finally {
    generando.value = false
  }
}
</script>