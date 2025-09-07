// src/server/services/auth.service.ts
// Server-only authentication business logic

import { prisma } from '../database/prisma'
import { verifyPassword } from '../auth/password'
import type { LoginDto, AuthUser, UserStatus } from '@/shared/types'

export class AuthService {
  async authenticate(credentials: LoginDto): Promise<AuthUser | null> {
    const { email, password } = credentials

    try {
      // Find user with roles
      const user = await prisma.user.findUnique({
        where: { email },
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
      if (user.status !== 'ACTIVE') {
        return null
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password)
      if (!isValidPassword) {
        return null
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      })

      // Transform to AuthUser
      return {
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
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  async findUserById(id: string): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
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

      return {
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
    } catch (error) {
      console.error('Find user error:', error)
      return null
    }
  }
}

export const authService = new AuthService()