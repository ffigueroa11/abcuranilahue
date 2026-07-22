<template>
  <div style="padding: 2rem; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
    <h1 style="color: #1a1a1a;">Asociación de Básquetbol Curanilahue</h1>
    <h2 style="color: #666; border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">Clubes Participantes</h2>
    
    <!-- Estado 1: Cargando -->
    <p v-if="pending" style="color: #0066cc;">Cargando clubes desde Supabase...</p>
    
    <!-- Estado 2: Con datos -->
    <ul v-else-if="clubes && clubes.length > 0" style="list-style-type: none; padding: 0;">
      <li 
        v-for="club in clubes" 
        :key="club.id"
        style="padding: 1rem; background-color: #f9f9f9; margin-bottom: 0.5rem; border-radius: 8px; border: 1px solid #ddd;"
      >
        <strong>{{ club.nombre }}</strong>
      </li>
    </ul>
    
    <!-- Estado 3: Vacío -->
    <div v-else style="background-color: #fff3cd; padding: 1rem; border-radius: 8px; color: #856404;">
      <p style="margin: 0;">Aún no hay clubes registrados en la base de datos.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt hace la petición a tu archivo server/api/clubes.get.ts automáticamente
const { data: clubes, pending } = useFetch('/api/clubes')
</script>