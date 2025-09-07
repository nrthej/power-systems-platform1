// src/server/auth/next-auth.config.ts
// Server-only NextAuth configuration

import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../database/prisma'
import { verifyPassword } from './password'
import { UserStatus, type AuthUser } from '@/shared/types'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user with roles
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              userRoles: {
                include: {
                  role: true
                }
              }
            }
          })

          if (!user || user.status !== 'ACTIVE') {
            return null
          }

          // Verify password
          const isValidPassword = await verifyPassword(credentials.password, user.password)
          if (!isValidPassword) {
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          // Transform to AuthUser format
          const authUser: AuthUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            status: user.status as UserStatus,
            roles: user.userRoles.map(ur => ({
              id: ur.role.id,
              name: ur.role.name,
              description: ur.role.description,
              color: ur.role.color
            }))
          }

          return {
            id: authUser.id,
            email: authUser.email,
            name: authUser.name,
            image: authUser.avatar,
            // Store additional data for JWT callback
            ...authUser
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.status = (user as any).status
        token.roles = (user as any).roles
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.status = token.status as UserStatus
        session.user.roles = token.roles as AuthUser['roles']
      }
      return session
    }
  },
  pages: {
    signIn: '/',
    error: '/'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 60   // Update session every hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface User {
    id: string
    status: UserStatus
    roles: AuthUser['roles']
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      status: UserStatus
      roles: AuthUser['roles']
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    status: UserStatus
    roles: AuthUser['roles']
  }
}