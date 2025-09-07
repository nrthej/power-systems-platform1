import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { comparePassword } from './bcrypt'
import { UserStatus } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string | null
  status: UserStatus
  roles: {
    id: string
    name: string
    color: string
  }[]
}

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
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email 
            },
            include: {
              userRoles: {
                include: {
                  role: true
                }
              }
            }
          })

          if (!user) {
            return null
          }

          // Check if user is active
          if (user.status !== UserStatus.ACTIVE) {
            return null
          }

          const isValidPassword = await comparePassword(
            credentials.password,
            user.password
          )

          if (!isValidPassword) {
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            status: user.status,
            roles: user.userRoles.map(ur => ({
              id: ur.role.id,
              name: ur.role.name,
              color: ur.role.color
            }))
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
      if (token) {
        session.user.id = token.id as string
        session.user.status = token.status as UserStatus
        session.user.roles = token.roles as AuthUser['roles']
      }
      return session
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Type extensions for NextAuth
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