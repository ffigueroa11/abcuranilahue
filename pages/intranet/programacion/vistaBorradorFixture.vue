<template>
  <div class="max-w-[1200px] mx-auto p-4 sm:p-6">
    <!-- Encabezado -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 text-xs font-black tracking-widest uppercase mb-3">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Staging Area
        </div>
        <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Calendario Integrado</h2>
        <p class="text-zinc-400 text-sm mt-1">Revisa cómo se cruzan todas las categorías antes de publicar los fixtures.</p>
      </div>
    </div>

    <!-- Cargador -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
    </div>

    <!-- Estado Vacío -->
    <div v-else-if="!lotesRaw || lotesRaw.length === 0" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center shadow-lg">
      <svg class="w-12 h-12 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 class="text-zinc-300 font-black uppercase tracking-widest text-sm mb-1">Sin Programación</h3>
      <p class="text-zinc-500 text-xs">Utiliza el generador para crear nuevos fixtures en borrador.</p>
    </div>

    <div v-else class="space-y-10">
      
      <!-- PANEL DE ADMINISTRACIÓN DE LOTES (Para aprobar o descartar) -->      
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 class="text-xs font-black text-zinc-500 uppercase tracking-widest">Lotes Pendientes de Aprobación</h3>
          
          <!-- NUEVO BOTÓN: BORRAR TODO -->
          <button 
            @click="descartarTodo" 
            class="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Descartar Todo
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div v-for="lote in lotesRaw" :key="lote.codigo" class="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
            <div class="mb-4">
              <h4 class="text-amber-500 font-black uppercase tracking-wider text-sm">{{ lote.categoria }}</h4>
              <p class="text-[10px] text-zinc-500 font-bold mt-1">LOTE: {{ lote.codigo }} • {{ lote.partidos.length }} PARTIDOS</p>
            </div>
            <div class="flex gap-2">
              <button @click="descartarLote(lote.codigo)" class="flex-1 py-2 bg-zinc-900 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-900 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors">
                Descartar
              </button>
              <button @click="publicarLote(lote.codigo)" class="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VISTA GLOBAL POR JORNADAS -->
      <div class="relative space-y-10 pl-2 sm:pl-6 border-l-2 border-zinc-800 ml-2 sm:ml-4">
        <div v-for="jornada in jornadasGlobales" :key="jornada.fechaKey" class="relative">
          
          <!-- Indicador visual de la línea de tiempo -->
          <div class="absolute -left-[19px] sm:-left-[35px] top-1.5 w-4 h-4 bg-zinc-950 border-[3px] border-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
          
          <!-- Encabezado de la Jornada -->
          <div class="mb-5 bg-zinc-900/40 inline-block px-4 py-2 rounded-xl border border-zinc-800/80 backdrop-blur-sm">
            <h4 class="text-white font-black uppercase tracking-tight text-xl flex items-center gap-2">
              Jornada {{ jornada.numero }}
            </h4>
            <span class="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ formatFechaLarga(jornada.partidos[0].fecha_hora) }}
            </span>
          </div>

          <!-- Grilla de Tarjetas de Partidos (Mezclados) -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div v-for="partido in jornada.partidos" :key="partido.id" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-amber-500/30 hover:bg-zinc-800/50 transition-all shadow-lg flex flex-col group relative overflow-hidden">
              
              <!-- Línea de color superior según si es borrador -->
              <div class="absolute top-0 left-0 w-full h-1 bg-zinc-700 group-hover:bg-amber-500 transition-colors"></div>

              <div class="flex justify-between items-center mb-4 border-b border-zinc-800/80 pb-3 mt-1">
                <span class="text-[9px] font-black text-white uppercase tracking-widest bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700">
                  {{ partido.categoriaNombre }}
                </span>
                <span class="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {{ formatHora(partido.fecha_hora) }}
                </span>
              </div>

              <!-- Equipos -->
              <div class="flex items-center justify-between flex-1">
                <!-- Local -->
                <div class="flex flex-col items-center flex-1 text-center gap-1.5">
                  <div class="w-12 h-12 bg-zinc-950 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 shadow-inner">
                    <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-1" />
                    <span v-else class="text-xs text-zinc-500 font-black">{{ partido.local.nombre.charAt(0) }}</span>
                  </div>
                  <span class="font-bold text-xs uppercase text-zinc-200 truncate w-full px-1">{{ partido.local.nombre }}</span>
                </div>
                
                <span class="text-[10px] font-black text-zinc-600 px-2">VS</span>
                
                <!-- Visita -->
                <div class="flex flex-col items-center flex-1 text-center gap-1.5">
                  <div class="w-12 h-12 bg-zinc-950 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 shadow-inner">
                    <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-1" />
                    <span v-else class="text-xs text-zinc-500 font-black">{{ partido.visita.nombre.charAt(0) }}</span>
                  </div>
                  <span class="font-bold text-xs uppercase text-zinc-200 truncate w-full px-1">{{ partido.visita.nombre }}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  layout: 'intranet',
  middleware: 'auth'
})

const { data: lotesRaw, pending, refresh } = useFetch('/api/fixture/borradores')

// ==========================================
// LÓGICA DE AGRUPACIÓN GLOBAL POR JORNADA
// ==========================================
const jornadasGlobales = computed(() => {
  if (!lotesRaw.value) return []

  const jornadasMap = new Map<string, any[]>()

  // 1. Extraemos TODOS los partidos de TODOS los lotes y los agrupamos por fecha
  lotesRaw.value.forEach((lote: any) => {
    lote.partidos.forEach((partido: any) => {
      const dateObj = new Date(partido.fecha_hora)
      // Llave de agrupación: AAAA-MM-DD
      const dateKey = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`

      if (!jornadasMap.has(dateKey)) {
        jornadasMap.set(dateKey, [])
      }
      
      // Inyectamos el nombre de la categoría y el lote al partido para la tarjeta
      jornadasMap.get(dateKey)!.push({
        ...partido,
        categoriaNombre: lote.categoria,
        codigoLote: lote.codigo
      })
    })
  })

  // 2. Convertimos el Mapa a Array, lo ordenamos cronológicamente y le asignamos número de jornada
  return Array.from(jornadasMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([fechaKey, partidos], index) => {
      
      // Opcional: Ordenar los partidos dentro de la misma jornada por hora
      const partidosOrdenados = partidos.sort((p1, p2) => new Date(p1.fecha_hora).getTime() - new Date(p2.fecha_hora).getTime())

      return {
        numero: index + 1, // Jornada 1, Jornada 2, etc.
        fechaKey,
        partidos: partidosOrdenados
      }
    })
})

// ==========================================
// FUNCIONES DE FORMATO
// ==========================================
const formatHora = (fecha: string | Date) => {
  const date = new Date(fecha)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} hrs`
}

const formatFechaLarga = (fecha: string | Date) => {
  const date = new Date(fecha)
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]}`
}

// ==========================================
// ACCIONES (Endpoints a implementar en backend)
// ==========================================
// ==========================================
// ACCIONES 
// ==========================================

// NUEVA FUNCIÓN: Borrar todos los borradores
const descartarTodo = async () => {
  if (!confirm('¿Estás COMPLETAMENTE SEGURO de que deseas eliminar TODOS los fixtures en borrador? Esta acción no se puede deshacer.')) return
  
  try {
    await $fetch('/api/fixture/borrarFixture', { method: 'DELETE' })
    alert('Todos los borradores han sido eliminados correctamente.')
    refresh() // Recarga los datos de la vista (quedará vacía)
  } catch (error) {
    console.error('Error al descartar todo:', error)
    alert('Ocurrió un error al intentar vaciar la papelera de borradores.')
  }
}

const descartarLote = async (codigoLote: string) => {
  if (!confirm(`¿Seguro que deseas eliminar el borrador ${codigoLote}?`)) return
  try {
    // await $fetch(`/api/fixture/borradores/${codigoLote}`, { method: 'DELETE' })
    alert('Borrador eliminado (Endpoint DELETE pendiente)')
    refresh()
  } catch (error) {
    console.error('Error al descartar:', error)
  }
}

const publicarLote = async (codigoLote: string) => {
  if (!confirm(`¿Estás seguro? Esto publicará la categoría oficialmente.`)) return
  try {
    // await $fetch(`/api/fixture/borradores/${codigoLote}/publicar`, { method: 'POST' })
    alert('Fixture publicado exitosamente (Endpoint POST pendiente)')
    refresh()
  } catch (error) {
    console.error('Error al publicar:', error)
  }
}


</script>