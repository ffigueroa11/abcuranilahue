<template>
  <div>
    <!-- Botón Volver -->
    <div class="mb-6">
      <NuxtLink to="/intranet/clubes" class="text-zinc-500 hover:text-zinc-300 font-bold text-xs uppercase tracking-widest flex items-center gap-1 w-fit transition-colors">
        &larr; Volver a Clubes
      </NuxtLink>
    </div>

    <!-- Carga inicial -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
    </div>

    <div v-else-if="club">
      <!-- Encabezado del Club -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 bg-zinc-950 border border-zinc-700 rounded-full flex items-center justify-center overflow-hidden shadow-inner">
            <img v-if="club.logo_url" :src="club.logo_url" class="w-full h-full object-cover p-1.5" />
            <span v-else class="text-2xl font-black text-zinc-600">{{ club.nombre.charAt(0) }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-black text-white uppercase tracking-tight">{{ club.nombre }}</h1>
            <p class="text-zinc-400 text-sm font-medium mt-1">Plantilla Oficial</p>
          </div>
        </div>
        
        <button 
          @click="modalAbierto = true"
          class="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Inscribir Jugador
        </button>
      </div>

      <!-- Tabla de Jugadores -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-950/50 border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500 font-black">
                <th class="px-6 py-4 w-16 text-center">Nº</th>
                <th class="px-6 py-4">Nombre del Jugador</th>
                <th class="px-6 py-4">Posición</th>
                <th class="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              <!-- Fila de estado vacío -->
              <tr v-if="!club?.jugadores || club.jugadores.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-zinc-500 text-sm">
                  No hay jugadores inscritos en este club.
                </td>
              </tr>
              
              <!-- Lista de jugadores (Envueltos en template para renderizado seguro) -->
              <template v-else>
                <tr v-for="jugador in club.jugadores" :key="jugador.id" class="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                  <td class="px-6 py-4 text-center font-black text-lg">
                    <span v-if="jugador.numero" class="text-amber-500">{{ jugador.numero }}</span>
                    <span v-else class="text-zinc-600 text-sm">--</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-zinc-200 uppercase">{{ jugador.nombre }}</div>
                    <!-- Badges de categorías -->
                    <div class="flex flex-wrap gap-1 mt-1.5" v-if="jugador.categorias && jugador.categorias.length > 0">
                      <span v-for="cat in jugador.categorias" :key="cat.id" class="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded">
                        {{ cat.nombre }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-zinc-400 text-sm uppercase tracking-wider">{{ jugador.posicion || '--' }}</td>
                  
                  <td class="px-6 py-4 text-center">
                    <span v-if="jugador.activo" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-900/20 border border-green-900/50 text-green-500 text-[10px] font-black uppercase tracking-widest">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Activo
                    </span>
                    <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-900/20 border border-red-900/50 text-red-500 text-[10px] font-black uppercase tracking-widest">
                      <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Inactivo
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo Jugador -->
    <div v-if="modalAbierto" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 class="text-xl font-black text-white uppercase tracking-wider mb-6 border-b border-zinc-800 pb-4">Nuevo Jugador</h2>
        
        <form @submit.prevent="guardarJugador" class="space-y-4">
          <div>
            <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Nombre Completo</label>
            <input v-model="formulario.nombre" type="text" required class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-600 transition-all"/>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Dorsal (Nº)</label>
              <input v-model="formulario.numero" type="number" min="0" max="99" placeholder="Opcional" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-600 transition-all"/>
            </div>
            <div>
              <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Posición</label>
              <select v-model="formulario.posicion" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-600 transition-all appearance-none">
                <option value="">Seleccionar...</option>
                <option value="Base">Base (1)</option>
                <option value="Escolta">Escolta (2)</option>
                <option value="Alero">Alero (3)</option>
                <option value="Ala-Pívot">Ala-Pívot (4)</option>
                <option value="Pívot">Pívot (5)</option>
              </select>
            </div>
          </div>

          <div v-if="categorias && categorias.length > 0" class="pt-2">
            <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Categorías Inscritas</label>
            <div class="flex flex-wrap gap-3">
              <label v-for="cat in categorias" :key="cat.id" class="flex items-center gap-2 cursor-pointer bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg hover:border-amber-600/50 transition-colors">
                <input type="checkbox" :value="cat.id" v-model="formulario.categoriasIds" class="w-4 h-4 text-amber-600 rounded border-zinc-700 bg-zinc-900 focus:ring-amber-600 focus:ring-offset-zinc-900" />
                <span class="text-xs font-bold text-zinc-300 uppercase">{{ cat.nombre }}</span>
              </label>
            </div>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="modalAbierto = false" class="flex-1 px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg font-bold text-sm uppercase transition-colors">Cancelar</button>
            <button type="submit" :disabled="guardando" class="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-bold text-sm uppercase transition-colors flex items-center justify-center">
              <span v-if="guardando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Inscribir
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

const route = useRoute()
const clubId = route.params.id

// Cargas de datos
const { data: club, pending, refresh } = useFetch(`/api/intranet/clubes/${clubId}`)
const { data: categorias } = useFetch('/api/intranet/categorias') // Traemos las categorías

// Estado del formulario
const modalAbierto = ref(false)
const guardando = ref(false)
const formulario = ref({ 
  nombre: '', 
  numero: '', 
  posicion: '', 
  club_id: clubId,
  categoriasIds: [] as number[] // Arreglo para guardar los checkboxes seleccionados
})

const guardarJugador = async () => {
  guardando.value = true
  try {
    const nuevoJugador: any = await $fetch('/api/intranet/jugadores', {
      method: 'POST',
      body: formulario.value
    })
    
    modalAbierto.value = false
    formulario.value = { nombre: '', numero: '', posicion: '', club_id: clubId, categoriasIds: [] }
    
    if (club.value && club.value.jugadores) {
      club.value.jugadores.push(nuevoJugador)
      // Re-ordenar localmente para mantener el orden alfabético
      club.value.jugadores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))
    } else {
      await refresh()
    }

  } catch (error) {
    alert('Error al guardar el jugador')
  } finally {
    guardando.value = false
  }
}
</script>