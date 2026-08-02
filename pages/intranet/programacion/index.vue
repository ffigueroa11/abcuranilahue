<template>
  <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
    <h2 class="text-xl font-black text-white uppercase tracking-wider mb-6">Generador de Fixture</h2>

    <form @submit.prevent="generarFixture" class="space-y-6">
      
      <!-- Selección de Categoría -->
      <div>
        <label class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Categoría</label>
        <select v-model="form.categoriaId" required class="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 focus:border-amber-500 outline-none">
          <option value="" disabled>Seleccione categoría...</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>
      </div>

      <!-- Selección de Equipos (Múltiple) -->
      <div>
        <label class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Equipos Participantes</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
          <label v-for="equipo in equiposDisponibles" :key="equipo.id" class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" :value="equipo.id" v-model="form.equiposIds" class="text-amber-500 rounded bg-zinc-900 border-zinc-700">
            <span class="text-sm text-zinc-300">{{ equipo.nombre }}</span>
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Fecha de Inicio -->
        <div>
          <label class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Primer Partido</label>
          <input type="date" v-model="form.fechaInicio" required class="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 focus:border-amber-500 outline-none">
        </div>

        <!-- Intervalo de Días (El secreto de la lógica) -->
        <div>
          <label class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Frecuencia</label>
          <select v-model="form.intervaloDias" required class="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 focus:border-amber-500 outline-none">
            <option :value="7">Semanal (Cada 7 días)</option>
            <option :value="14">Quincenal (Cada 14 días)</option>
          </select>
        </div>

        <!-- Partidos por Día -->
        <div>
          <label class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Partidos / Día</label>
          <input type="number" v-model="form.partidosPorDia" min="1" required class="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 focus:border-amber-500 outline-none">
        </div>
      </div>

      <button type="submit" :disabled="pending" class="w-full bg-amber-600 hover:bg-amber-500 text-zinc-900 font-black uppercase tracking-widest py-4 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4">
        <span v-if="pending" class="animate-spin h-5 w-5 border-2 border-zinc-900 border-t-transparent rounded-full"></span>
        {{ pending ? 'Generando Fixture...' : 'Generar Campeonato' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'intranet',
  middleware: 'auth'
})

interface Categoria {
  id: number;
  nombre: string;
}
interface Club {
  id: number;
  nombre: string;
}

const { data: categorias } = useFetch<Categoria[]>('/api/intranet/categorias')
const { data: equiposDisponibles } = useFetch<Club[]>('/api/intranet/clubes')

const pending = ref(false)
const form = ref({
  categoriaId: '',
  equiposIds: [],
  fechaInicio: '',
  intervaloDias: 7,
  partidosPorDia: 2
})

const generarFixture = async () => {
  if (form.value.equiposIds.length < 2) return alert('Selecciona al menos 2 equipos')
  
  pending.value = true
  try {
    const respuesta = await $fetch('/api/fixture/generar-borrador', {
      method: 'POST',
      body: form.value
    })
    
    alert(`Se han generado ${respuesta.generados} partidos en el borrador (Lote: ${respuesta.lote}). Revisa la vista previa antes de publicar.`)
    
  } catch (error) {
    alert('Error al generar el fixture borrador.')
    console.error(error)
  } finally {
    pending.value = false
  }
}
</script>