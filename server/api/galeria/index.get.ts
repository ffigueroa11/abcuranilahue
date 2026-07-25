import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Asegúrate de tener estas variables en tu archivo .env
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_KEY || ''
  
  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, statusMessage: 'Credenciales de Supabase no configuradas' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const BUCKET_NAME = 'galeria' // Cambia esto si tu bucket tiene otro nombre
  const CARPETA = '' // Deja vacío si las imágenes están en la raíz del bucket

  
  // 1. Listar los archivos del bucket
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(CARPETA, {
    limit: 100, // Ajusta el límite según necesites
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' }
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  // 2. Filtrar archivos inválidos (como placeholders de carpetas vacías)
  const validFiles = data.filter(file => file.name !== '.emptyFolderPlaceholder' && file.id)

  // 3. Generar la URL pública para cada imagen
  const imagenes = validFiles.map(file => {
    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${CARPETA}${file.name}`)
    
    return {
      id: file.id,
      nombre: file.name,
      url: publicUrlData.publicUrl,
      fecha: file.created_at
    }
  })

  return imagenes
})