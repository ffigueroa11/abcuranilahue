import { prisma } from '../../utils/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email y contraseña son requeridos' })
  }

  // 1. Buscar al usuario en la base de datos
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  })

  // 2. Verificar si existe y si está activo
  if (!usuario || !usuario.activo) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas o cuenta inactiva' })
  }

  // 3. Comparar la contraseña ingresada con el hash guardado
  const passwordValida = await bcrypt.compare(password, usuario.password_hash)
  if (!passwordValida) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' })
  }

  // 4. Generar el Token JWT (Firma segura)
  // En producción, debes tener un JWT_SECRET en tu archivo .env
  const secret = process.env.JWT_SECRET || 'clave_secreta_temporal_muy_segura_abc'
  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol,
      club_id: usuario.club_id 
    }, 
    secret, 
    { expiresIn: '7d' } // La sesión durará 7 días en el celular
  )

  // 5. Configurar la Cookie HttpOnly
  setCookie(event, 'auth_token', token, {
    httpOnly: false, 
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
    path: '/' // Disponible en toda la aplicación
  })

  // 6. Retornar los datos públicos del usuario (nunca el hash)
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
    token: token // Devolvemos el token para que el cliente lo pueda usar
  }
})