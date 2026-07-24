<template>
  <div>
    <!-- Encabezado y Acciones -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white uppercase tracking-tight mb-1">Fixture y Programación</h1>
        <p class="text-zinc-400 text-sm">Organiza las fechas, horarios y cruces del campeonato.</p>
      </div>
      
      <button 
        @click="modalAbierto = true"
        class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        Programar Partido
      </button>
    </div>

    <!-- NUEVO: Barra de Filtros -->
    <div v-if="partidos && partidos.length > 0" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <!-- Filtro Categoría -->
      <div>
        <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Serie / Categoría</label>
        <select v-model="filtros.categoria" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-blue-600 focus:outline-none transition-colors appearance-none">
          <option value="todas">Todas las Categorías</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>
      </div>

      <!-- Filtro Estado -->
      <div>
        <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Estado del Partido</label>
        <select v-model="filtros.estado" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-blue-600 focus:outline-none transition-colors appearance-none">
          <option value="todos">Todos los Estados</option>
          <option value="PROGRAMADO">Solo Programados</option>
          <option value="FINALIZADO">Solo Finalizados</option>
        </select>
      </div>

      <!-- Filtro Calidad de Datos (Planilla) -->
      <div>
        <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Estado de Planilla</label>
        <select v-model="filtros.cuadrada" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-blue-600 focus:outline-none transition-colors appearance-none">
          <option value="todos">Cualquier Estado</option>
          <option value="cuadrada">Planillas Cuadradas (OK)</option>
          <option value="faltan">Faltan Datos (Revisar)</option>
        </select>
      </div>
    </div>

    <!-- Lista de Partidos -->
    <div v-if="pendingFixture" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="partidosFiltrados && partidosFiltrados.length > 0" class="grid gap-4">
      <div 
        v-for="partido in partidosFiltrados" 
        :key="partido.id"
        class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-zinc-700 transition-colors"
      >
        <!-- Info de Fecha y Categoría (Este es tu código original intacto) -->
        <div class="flex flex-col items-center lg:items-start min-w-[150px]">
          <span class="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-1">Jornada {{ partido.jornada }}</span>
          <span class="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded mb-2 uppercase">
            {{ partido.categoria.nombre }}
          </span>
          <span class="text-amber-500 font-bold text-sm">{{ formatearFecha(partido.fecha_hora) }}</span>
        </div>

        <!-- Marcador / Equipos (Este es tu código original intacto) -->
        <div class="flex-1 flex items-center justify-center gap-4 sm:gap-8 w-full">
          <!-- Local -->
          <div class="flex flex-col items-center gap-2 flex-1">
            <div class="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
              <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-1" />
              <span v-else class="text-lg font-black text-zinc-600">{{ partido.local.nombre.charAt(0) }}</span>
            </div>
            <span class="text-white font-black uppercase text-sm sm:text-base text-center">{{ partido.local.nombre }}</span>
          </div>

          <!-- VS o Resultado -->
          <div class="flex flex-col items-center justify-center px-4">
            <div v-if="partido.estado === 'FINALIZADO'" class="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg">
              <span class="text-2xl font-black text-white">{{ partido.score_local }}</span>
              <span class="text-zinc-600 font-black">-</span>
              <span class="text-2xl font-black text-white">{{ partido.score_visita }}</span>
            </div>
            <span v-else class="text-zinc-600 font-black italic text-xl">VS</span>
            
            <span 
              class="text-[10px] font-black uppercase tracking-widest mt-2"
              :class="partido.estado === 'FINALIZADO' ? 'text-zinc-500' : 'text-green-500 animate-pulse'"
            >
              {{ partido.estado }}
            </span>
          </div>

          <!-- Visita -->
          <div class="flex flex-col items-center gap-2 flex-1">
            <div class="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
              <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-1" />
              <span v-else class="text-lg font-black text-zinc-600">{{ partido.visita.nombre.charAt(0) }}</span>
            </div>
            <span class="text-white font-black uppercase text-sm sm:text-base text-center">{{ partido.visita.nombre }}</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="min-w-[140px] flex flex-col justify-center items-end w-full lg:w-auto gap-2">
          <NuxtLink 
            :to="`/intranet/partidos/${partido.id}/planilla`"
            class="w-full lg:w-auto text-center border border-zinc-700 hover:border-amber-500 text-zinc-300 hover:text-amber-500 px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-colors"
          >
            {{ partido.estado === 'FINALIZADO' ? 'Ver Estadísticas' : 'Mesa de Control' }}
          </NuxtLink>

          <!-- MARCA: Planilla Cuadrada -->
          <div v-if="partido.planilla_cuadrada" class="flex justify-center lg:justify-end w-full">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-950/60 border border-green-900 text-green-500 text-[9px] font-black uppercase tracking-widest shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Planilla Cuadrada
            </span>
          </div>

          <!-- MARCA: Faltan Datos -->
          <div v-else-if="partido.estado === 'FINALIZADO' && !partido.planilla_cuadrada" class="flex justify-center lg:justify-end w-full">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/60 border border-red-900 text-red-500 text-[9px] font-black uppercase tracking-widest shadow-sm animate-pulse">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Faltan Datos
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- NUEVO: Mensaje si los filtros ocultan todo -->
    <div v-else-if="partidos && partidos.length > 0" class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
      <h3 class="text-zinc-300 font-bold text-lg mb-2">Sin Resultados</h3>
      <p class="text-zinc-500 text-sm">No hay partidos que coincidan con los filtros seleccionados.</p>
      <button @click="filtros = { categoria: 'todas', estado: 'todos', cuadrada: 'todos' }" class="mt-4 text-amber-500 font-bold text-xs uppercase hover:underline">
        Limpiar Filtros
      </button>
    </div>

    <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
      <h3 class="text-zinc-300 font-bold text-lg mb-2">Fixture Vacío</h3>
      <p class="text-zinc-500 text-sm">No hay partidos programados en el sistema.</p>
    </div>

    <!-- Modal Programar Partido -->
    <div v-if="modalAbierto" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl my-8">
        <h2 class="text-xl font-black text-white uppercase tracking-wider mb-6 border-b border-zinc-800 pb-4">Programar Encuentro</h2>
        
        <form @submit.prevent="guardarPartido" class="space-y-5">
          <!-- Fecha y Jornada -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Jornada / Fecha</label>
              <input v-model="formulario.jornada" type="number" required min="1" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all"/>
            </div>
            <div>
              <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Día y Hora</label>
              <input v-model="formulario.fecha_hora" type="datetime-local" required class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all [color-scheme:dark]"/>
            </div>
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Categoría / Serie</label>
            <select v-model="formulario.categoria_id" required class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all appearance-none">
              <option value="" disabled>Seleccione una categoría...</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
            </select>
          </div>

          <!-- Equipos -->
          <div class="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <!-- Conector visual -->
            <div class="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 border border-zinc-700 rounded-full items-center justify-center z-10 text-xs font-black text-zinc-500 italic">VS</div>

            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-center">Equipo Local</label>
              <select v-model="formulario.local_id" required class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all appearance-none">
                <option value="" disabled>Seleccionar...</option>
                <option v-for="club in clubes" :key="club.id" :value="club.id" :disabled="club.id === formulario.visita_id">{{ club.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-center">Equipo Visita</label>
              <select v-model="formulario.visita_id" required class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all appearance-none">
                <option value="" disabled>Seleccionar...</option>
                <option v-for="club in clubes" :key="club.id" :value="club.id" :disabled="club.id === formulario.local_id">{{ club.nombre }}</option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="modalAbierto = false" class="flex-1 px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg font-bold text-sm uppercase transition-colors">Cancelar</button>
            <button type="submit" :disabled="guardando" class="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-bold text-sm uppercase transition-colors flex items-center justify-center">
              <span v-if="guardando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Guardar Partido
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'intranet', middleware: 'auth' })

// Carga de datos base necesarios para el formulario y la lista
const { data: partidos, pending: pendingFixture, refresh } = useFetch('/api/intranet/fixture')
const { data: clubes } = useFetch('/api/intranet/clubes')
const { data: categorias } = useFetch('/api/intranet/categorias')

const filtros = ref({
  categoria: 'todas' as number | 'todas',
  estado: 'todos' as string,
  cuadrada: 'todos' as string
})

const partidosFiltrados = computed(() => {
  if (!partidos.value) return []

  return partidos.value.filter((p: any) => {
    // 1. Filtro por Categoría
    if (filtros.value.categoria !== 'todas' && p.categoria_id !== filtros.value.categoria) {
      return false
    }
    
    // 2. Filtro por Estado (Programado / Finalizado)
    if (filtros.value.estado !== 'todos' && p.estado !== filtros.value.estado) {
      return false
    }

    // 3. Filtro por Planilla (Cuadrada / Faltan Datos)
    if (filtros.value.cuadrada !== 'todos') {
      // Si buscamos las que están OK
      if (filtros.value.cuadrada === 'cuadrada' && !p.planilla_cuadrada) return false
      // Si buscamos las que tienen errores (Deben estar finalizadas y NO cuadradas)
      if (filtros.value.cuadrada === 'faltan' && (p.planilla_cuadrada || p.estado !== 'FINALIZADO')) return false
    }

    return true // Si pasa todas las validaciones, se muestra
  })
})

interface FormularioPartido {
  jornada: number | null;
  fecha_hora: string;
  local_id: number | null;
  visita_id: number | null;
  categoria_id: number | null;
}

// Estado del formulario
const modalAbierto = ref(false)
const guardando = ref(false)
const formulario = ref<FormularioPartido>({
  jornada: null,
  fecha_hora: '',
  local_id: null,
  visita_id: null,
  categoria_id: null
})

// Función para darle formato legible a la fecha
const formatearFecha = (fechaString: string) => {
  const opciones: Intl.DateTimeFormatOptions = { 
    weekday: 'short', day: '2-digit', month: 'short', 
    hour: '2-digit', minute: '2-digit', hour12: false 
  }
  return new Date(fechaString).toLocaleDateString('es-CL', opciones).replace(',', ' -')
}

// Guardar nuevo partido (Usando Optimistic Update)
const guardarPartido = async () => {
  guardando.value = true
  try {
    const nuevoPartido: any = await $fetch('/api/intranet/fixture', {
      method: 'POST',
      body: formulario.value
    })
    
    modalAbierto.value = false
    formulario.value = { jornada: null, fecha_hora: '', local_id: null, visita_id: null, categoria_id: null }
    
    if (partidos.value) {
      partidos.value.push(nuevoPartido)
      // Re-ordenamos localmente por fecha
      partidos.value.sort((a: any, b: any) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
    } else {
      await refresh()
    }

  } catch (error: any) {
    alert(error.data?.statusMessage || 'Error al programar el partido')
  } finally {
    guardando.value = false
  }
}
</script>