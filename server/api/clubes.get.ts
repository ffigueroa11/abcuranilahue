import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  // Prisma va a Supabase y trae todos los registros de la tabla Club
  const clubes = await prisma.club.findMany()
  
  return clubes
})