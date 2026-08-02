import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { categoriaId, equiposIds, fechaInicio, intervaloDias, partidosPorDia } = body

  // Generamos un identificador único para este intento de fixture
  const codigoLote = `GEN-${Date.now()}-${categoriaId}`

  // 1. Preparar equipos (Agregar "Bye"/Descanso si son impares)
  let equipos = [...equiposIds]
  if (equipos.length % 2 !== 0) {
    equipos.push(null) 
  }

  const numEquipos = equipos.length
  const rondas = numEquipos - 1
  const partidosPorRonda = numEquipos / 2
  
  const enfrentamientos = []

  // 2. Algoritmo Round-Robin
  for (let ronda = 0; ronda < rondas; ronda++) {
    for (let i = 0; i < partidosPorRonda; i++) {
      const local = equipos[i]
      const visita = equipos[numEquipos - 1 - i]

      if (local !== null && visita !== null) {
        if (i === 0 && ronda % 2 !== 0) {
          enfrentamientos.push({ local, visita })
        } else {
          enfrentamientos.push({ local: visita, visita: local })
        }
      }
    }
    const primerEquipo = equipos.shift()
    const ultimoEquipo = equipos.pop()
    equipos = [primerEquipo, ultimoEquipo, ...equipos]
  }
  
  // 3. Asignación de Fechas
  // Concatenamos 'T12:00:00' para forzar que la fecha base inicie al mediodía.
  // Esto evita que las diferencias de zona horaria empujen la fecha al día anterior.
  let fechaActual = new Date(`${fechaInicio}T12:00:00`)
  let contadorPartidosDia = 0
  
  const fixtureInsert = []

  for (const partido of enfrentamientos) {
    if (contadorPartidosDia >= partidosPorDia) {
      fechaActual.setDate(fechaActual.getDate() + intervaloDias)
      contadorPartidosDia = 0
    }

    const fechaHoraAsignada = new Date(fechaActual)
    
    // Insertamos la estructura correspondiente a la NUEVA tabla
    fixtureInsert.push({
      codigo_lote: codigoLote,
      categoria_id: categoriaId,
      local_id: partido.local,
      visita_id: partido.visita,
      fecha_hora: fechaHoraAsignada,
      estado: 'BORRADOR'
    })

    contadorPartidosDia++
  }

  // 4. Guardar masivamente en la tabla de Borradores
  await prisma.fixtureBorrador.createMany({
    data: fixtureInsert
  })

  return { 
    success: true, 
    generados: fixtureInsert.length,
    lote: codigoLote 
  }
})