import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoriaId = Number(query.categoriaId)

  if (!categoriaId) return []

  const partidos = await prisma.partido.findMany({
    where: {
      estado: 'FINALIZADO', // o 'PROGRAMADO' dependiendo del archivo
      categoria_id: categoriaId
    },
    orderBy: { fecha_hora: 'desc' }, 
    take: 3,
    include: { 
      local: true, 
      visita: true,
      categoria: true // <--- ESTA ES LA LÍNEA QUE DEBES AGREGAR
    }
  })
  
  return partidos
})