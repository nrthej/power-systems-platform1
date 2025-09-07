// src/app/api/auth/[...nextauth]/route.ts
// API route - calls services only, NO Prisma imports

import NextAuth from 'next-auth'
import { authOptions } from '@/server/auth/next-auth.config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }