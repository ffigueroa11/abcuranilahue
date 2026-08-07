import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de club no proporcionado' })
  }

  // Obtenemos el club con sus jugadores y las categorías a las que pertenece
  const club = await prisma.club.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      logo_url: true,
      
      // CORRECCIÓN 1: Obtenemos las categorías del club a través de sus 'posiciones'
      posiciones: {
        select: {
          categoria: {
            select: {
              id: true,
              nombre: true
            }
          }
        }
      },
      
      // Obtenemos todos los jugadores del club
      jugadores: {
        select: {
          id: true,
          nombre: true,
          numero: true,
          
          // CORRECCIÓN 2: La relación muchos-a-muchos implícita se llama directo 'categorias'
          categorias: {
            select: {
              id: true,
              nombre: true
            }
          }
        },
        orderBy: {
          numero: 'asc' // Ordenamos por dorsal numérico
        }
      }
    }
  })

  if (!club) {
    throw createError({ statusCode: 404, statusMessage: 'Club no encontrado' })
  }

  // Mapeamos los datos para entregárselos limpios al Frontend
  return {
    id: club.id,
    nombre: club.nombre,
    logo_url: club.logo_url,
    
    // Extraemos el array de categorías desde las posiciones del club
    categorias: club.posiciones.map(p => p.categoria),
    
    // El objeto de jugadores ya trae el array 'categorias' limpio gracias a la relación implícita
    jugadores: club.jugadores.map(jugador => ({
      id: jugador.id,
      nombre: jugador.nombre,
      numero: jugador.numero,
      categorias: jugador.categorias
    }))
  }
})