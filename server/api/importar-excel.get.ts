import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  // Data procesada y formateada desde el Excel
  const datosExcel = [
    {"Categoria":"TODO COMPETIDOR","Local":"Huillines","Puntos_Local":116,"Visita":"Manuel Bulnes","Puntos_Visita":105,"Fecha":"2026-04-25T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"San Patricio","Puntos_Local":78,"Visita":"Basket Arauco","Puntos_Visita":108,"Fecha":"2026-04-25T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Ramón Freire","Puntos_Local":48,"Visita":"Universitarios","Puntos_Visita":89,"Fecha":"2026-04-18T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"C.D. Navidad","Puntos_Local":86,"Visita":"Colico Sur","Puntos_Visita":67,"Fecha":"2026-04-18T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Colico Sur","Puntos_Local":69,"Visita":"Manuel Bulnes","Puntos_Visita":49,"Fecha":"2026-04-24T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Universitarios","Puntos_Local":109,"Visita":"San Patricio","Puntos_Visita":52,"Fecha":"2026-04-24T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"San Patricio","Puntos_Local":58,"Visita":"Manuel Bulnes","Puntos_Visita":46,"Fecha":"2026-04-25T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Universitarios","Puntos_Local":50,"Visita":"C.D. Navidad","Puntos_Visita":69,"Fecha":"2026-04-25T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Manuel Bulnes","Puntos_Local":56,"Visita":"C.D. Navidad","Puntos_Visita":89,"Fecha":"2026-05-02T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Basket Arauco","Puntos_Local":91,"Visita":"Ramón Freire","Puntos_Visita":62,"Fecha":"2026-05-02T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Ramón Freire","Puntos_Local":91,"Visita":"Basket Arauco","Puntos_Visita":117,"Fecha":"2026-05-02T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Colico Sur","Puntos_Local":148,"Visita":"Manuel Bulnes","Puntos_Visita":58,"Fecha":"2026-05-02T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Universitarios","Puntos_Local":86,"Visita":"Huillines","Puntos_Visita":64,"Fecha":"2026-05-08T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Ramón Freire","Puntos_Local":55,"Visita":"C.D. Navidad","Puntos_Visita":80,"Fecha":"2026-05-08T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Universitarios","Puntos_Local":102,"Visita":"Huillines","Puntos_Visita":93,"Fecha":"2026-05-09T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Colico Sur","Puntos_Local":101,"Visita":"San Patricio","Puntos_Visita":65,"Fecha":"2026-05-09T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Universitarios","Puntos_Local":75,"Visita":"San Patricio","Puntos_Visita":48,"Fecha":"2026-05-09T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Basket Arauco","Puntos_Local":45,"Visita":"Colico Sur","Puntos_Visita":50,"Fecha":"2026-05-09T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Ramón Freire","Puntos_Local":71,"Visita":"San Patricio","Puntos_Visita":65,"Fecha":"2026-05-16T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Huillines","Puntos_Local":81,"Visita":"Basket Arauco","Puntos_Visita":73,"Fecha":"2026-05-16T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Basket Arauco","Puntos_Local":70,"Visita":"Universitarios","Puntos_Visita":89,"Fecha":"2026-05-16T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Ramón Freire","Puntos_Local":98,"Visita":"Manuel Bulnes","Puntos_Visita":66,"Fecha":"2026-05-16T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"C.D. Navidad","Puntos_Local":100,"Visita":"Manuel Bulnes","Puntos_Visita":52,"Fecha":"2026-05-22T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Ramón Freire","Puntos_Local":106,"Visita":"San Patricio","Puntos_Visita":60,"Fecha":"2026-05-22T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Universitarios","Puntos_Local":80,"Visita":"C.D. Navidad","Puntos_Visita":93,"Fecha":"2026-05-23T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Colico Sur","Puntos_Local":100,"Visita":"Manuel Bulnes","Puntos_Visita":88,"Fecha":"2026-05-23T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Colico Sur","Puntos_Local":59,"Visita":"Manuel Bulnes","Puntos_Visita":41,"Fecha":"2026-05-23T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Basket Arauco","Puntos_Local":37,"Visita":"C.D. Navidad","Puntos_Visita":74,"Fecha":"2026-05-23T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"C.D. Navidad","Puntos_Local":79,"Visita":"Colico Sur","Puntos_Visita":69,"Fecha":"2026-06-05T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"San Patricio","Puntos_Local":48,"Visita":"Manuel Bulnes","Puntos_Visita":77,"Fecha":"2026-06-05T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Universitarios","Puntos_Local":115,"Visita":"Manuel Bulnes","Puntos_Visita":106,"Fecha":"2026-06-06T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Colico Sur","Puntos_Local":84,"Visita":"Ramón Freire","Puntos_Visita":60,"Fecha":"2026-06-06T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Colico Sur","Puntos_Local":61,"Visita":"San Patricio","Puntos_Visita":47,"Fecha":"2026-06-06T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"C.D. Navidad","Puntos_Local":92,"Visita":"Manuel Bulnes","Puntos_Visita":36,"Fecha":"2026-06-06T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"San Patricio","Puntos_Local":44,"Visita":"Colico Sur","Puntos_Visita":57,"Fecha":"2026-06-12T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"Maxi Lebu","Puntos_Local":74,"Visita":"Manuel Bulnes","Puntos_Visita":68,"Fecha":"2026-06-12T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Huillines","Puntos_Local":85,"Visita":"Ramón Freire","Puntos_Visita":87,"Fecha":"2026-06-13T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"C.D. Navidad","Puntos_Local":118,"Visita":"San Patricio","Puntos_Visita":61,"Fecha":"2026-06-13T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Universitarios","Puntos_Local":94,"Visita":"Colico Sur","Puntos_Visita":71,"Fecha":"2026-06-13T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Basket Arauco","Puntos_Local":100,"Visita":"Manuel Bulnes","Puntos_Visita":52,"Fecha":"2026-06-13T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Ramón Freire","Puntos_Local":66,"Visita":"Huillines","Puntos_Visita":83,"Fecha":"2026-06-19T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"San Patricio","Puntos_Local":62,"Visita":"Colico Sur","Puntos_Visita":70,"Fecha":"2026-06-19T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Colico Sur","Puntos_Local":105,"Visita":"Universitarios","Puntos_Visita":91,"Fecha":"2026-06-20T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Manuel Bulnes","Puntos_Local":66,"Visita":"Basket Arauco","Puntos_Visita":83,"Fecha":"2026-06-20T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Universitarios","Puntos_Local":63,"Visita":"Basket Arauco","Puntos_Visita":41,"Fecha":"2026-06-20T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"Ramón Freire","Puntos_Local":37,"Visita":"Deportivo Coronel","Puntos_Visita":91,"Fecha":"2026-06-26T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"C.D. Navidad","Puntos_Local":0,"Visita":"Ramón Freire","Puntos_Visita":20,"Fecha":"2026-06-27T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Manuel Bulnes","Puntos_Local":138,"Visita":"San Patricio","Puntos_Visita":60,"Fecha":"2026-06-27T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Basket Arauco","Puntos_Local":54,"Visita":"Colico Sur","Puntos_Visita":122,"Fecha":"2026-06-27T00:00:00Z"},
    {"Categoria":"JUVENILES","Local":"Universitarios","Puntos_Local":130,"Visita":"Ramón Freire","Puntos_Visita":89,"Fecha":"2026-06-27T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"Ramón Freire","Puntos_Local":50,"Visita":"Maxi Lebu","Puntos_Visita":71,"Fecha":"2026-06-28T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"San Patricio","Puntos_Local":20,"Visita":"Manuel Bulnes","Puntos_Visita":0,"Fecha":"2026-06-28T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Colico Sur","Puntos_Local":96,"Visita":"Huillines","Puntos_Visita":103,"Fecha":"2026-07-04T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Basket Arauco","Puntos_Local":64,"Visita":"Manuel Bulnes","Puntos_Visita":41,"Fecha":"2026-07-04T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Universitarios","Puntos_Local":68,"Visita":"Colico Sur","Puntos_Visita":37,"Fecha":"2026-07-04T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Universitarios","Puntos_Local":133,"Visita":"Basket Arauco","Puntos_Visita":118,"Fecha":"2026-07-04T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"Deportivo Coronel","Puntos_Local":63,"Visita":"Manuel Bulnes","Puntos_Visita":48,"Fecha":"2026-07-10T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"Ramón Freire","Puntos_Local":60,"Visita":"San Patricio","Puntos_Visita":48,"Fecha":"2026-07-10T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"C.D. Navidad","Puntos_Local":78,"Visita":"Huillines","Puntos_Visita":51,"Fecha":"2026-07-11T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Manuel Bulnes","Puntos_Local":116,"Visita":"Ramón Freire","Puntos_Visita":97,"Fecha":"2026-07-11T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"C.D. Navidad","Puntos_Local":20,"Visita":"Colico Sur","Puntos_Visita":0,"Fecha":"2026-07-11T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Basket Arauco","Puntos_Local":55,"Visita":"San Patricio","Puntos_Visita":42,"Fecha":"2026-07-11T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"San Patricio","Puntos_Local":50,"Visita":"C.D. Navidad","Puntos_Visita":120,"Fecha":"2026-07-17T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Huillines","Puntos_Local":64,"Visita":"Colico Sur","Puntos_Visita":66,"Fecha":"2026-07-17T00:00:00Z"},
    {"Categoria":"SENIOR","Local":"Universitarios","Puntos_Local":83,"Visita":"Manuel Bulnes","Puntos_Visita":67,"Fecha":"2026-07-17T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Universitarios","Puntos_Local":105,"Visita":"San Patricio","Puntos_Visita":56,"Fecha":"2026-07-18T00:00:00Z"},
    {"Categoria":"TODO COMPETIDOR","Local":"Colico Sur","Puntos_Local":71,"Visita":"Basket Arauco","Puntos_Visita":88,"Fecha":"2026-07-18T00:00:00Z"},
    {"Categoria":"DAMAS","Local":"Universitarios","Puntos_Local":68,"Visita":"Manuel Bulnes","Puntos_Visita":39,"Fecha":"2026-07-18T00:00:00Z"},
    {"Categoria":"SÚPER SENIOR","Local":"Maxi Lebu","Puntos_Local":52,"Visita":"Colico Sur","Puntos_Visita":64,"Fecha":"2027-06-26T00:00:00Z"}
  ]

let insertados = 0

  for (const p of datosExcel) {
    // 1. Validar Categoría (Ignorando mayúsculas/minúsculas y espacios)
    let cat = await prisma.categoria.findFirst({ 
      where: { nombre: { equals: p.Categoria.trim(), mode: 'insensitive' } } 
    })
    if (!cat) cat = await prisma.categoria.create({ data: { nombre: p.Categoria.trim() } })

    // 2. Validar Equipo Local
    let local = await prisma.club.findFirst({ 
      where: { nombre: { equals: p.Local.trim(), mode: 'insensitive' } } 
    })
    if (!local) local = await prisma.club.create({ data: { nombre: p.Local.trim() } })

    // 3. Validar Equipo Visita
    let visita = await prisma.club.findFirst({ 
      where: { nombre: { equals: p.Visita.trim(), mode: 'insensitive' } } 
    })
    if (!visita) visita = await prisma.club.create({ data: { nombre: p.Visita.trim() } })

    // 4. Detectar Walkover (W.O.)
    const woLocal = p.Puntos_Local === 0 && p.Puntos_Visita === 20
    const woVisita = p.Puntos_Local === 20 && p.Puntos_Visita === 0

    // 5. Inyectar partido a Prisma
    await prisma.partido.create({
      data: {
        categoria_id: cat.id,
        local_id: local.id,
        visita_id: visita.id,
        fecha_hora: new Date(p.Fecha),
        estado: 'FINALIZADO',
        score_local: p.Puntos_Local,
        score_visita: p.Puntos_Visita,
        forfeit_local: woLocal,
        forfeit_visita: woVisita,
        jornada: 1
      }
    })
    insertados++
  }

  return { 
    status: 'success', 
    message: `Se insertaron ${insertados} partidos correctamente. Actualiza tu página principal.` 
  }
})