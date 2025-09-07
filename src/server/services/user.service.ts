// src/server/services/user.service.ts
// Server-only user business logic

import { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma'
import { hashPassword } from '../auth/password'
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserPaginationParams,
  PaginatedUsers,
  UserStatus
} from '@/shared/types'

export class UserService {
  // Transform Prisma user to frontend-safe User type
  private transformUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      avatar: prismaUser.avatar,
      status: prismaUser.status as UserStatus,
      lastLogin: prismaUser.lastLogin,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      roles: prismaUser.userRoles?.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
        color: ur.role.color
      })) || []
    }
  }

  async findMany(params: UserPaginationParams): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, search = '', status } = params
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status })
    }

    // Execute queries
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return {
      items: users.map(user => this.transformUser(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async findById(id: string): Promise<User | null> {
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

    return user ? this.transformUser(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
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

    return user ? this.transformUser(user) : null
  }

  async create(data: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(data.email)
    if (existingUser) {
      throw new Error('Email already in use')
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user with roles in transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          avatar: data.avatar,
          status: data.status || 'ACTIVE'
        }
      })

      // Assign roles if provided
      if (data.roleIds && data.roleIds.length > 0) {
        // Verify roles exist
        const rolesCount = await tx.role.count({
          where: { id: { in: data.roleIds } }
        })

        if (rolesCount !== data.roleIds.length) {
          throw new Error('One or more roles not found')
        }

        // Create user-role relationships
        await tx.userRole.createMany({
          data: data.roleIds.map(roleId => ({
            userId: newUser.id,
            roleId
          }))
        })
      }

      // Return user with roles
      return tx.user.findUnique({
        where: { id: newUser.id },
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      })
    })

    return this.transformUser(user)
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.findById(id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    // Check email uniqueness if email is being changed
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.findByEmail(data.email)
      if (emailExists) {
        throw new Error('Email already in use')
      }
    }

    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      status: data.status
    }

    // Hash password if provided
    if (data.password) {
      updateData.password = await hashPassword(data.password)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    return this.transformUser(updatedUser)
  }

  async delete(id: string): Promise<void> {
    // Check if user exists
    const user = await this.findById(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Delete user and related data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete user roles
      await tx.userRole.deleteMany({
        where: { userId: id }
      })

      // Delete user
      await tx.user.delete({
        where: { id }
      })
    })
  }

  async manageRoles(userId: string, roleIds: string[], action: 'add' | 'remove' | 'replace'): Promise<User> {
    // Check if user exists
    const user = await this.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Verify roles exist
    if (roleIds.length > 0) {
      const rolesCount = await prisma.role.count({
        where: { id: { in: roleIds } }
      })

      if (rolesCount !== roleIds.length) {
        throw new Error('One or more roles not found')
      }
    }

    // Perform role operation in transaction
    await prisma.$transaction(async (tx) => {
      switch (action) {
        case 'add':
          // Check for existing roles to avoid duplicates
          const existingRoles = await tx.userRole.findMany({
            where: { userId, roleId: { in: roleIds } }
          })

          const existingRoleIds = existingRoles.map(ur => ur.roleId)
          const newRoleIds = roleIds.filter(id => !existingRoleIds.includes(id))

          if (newRoleIds.length > 0) {
            await tx.userRole.createMany({
              data: newRoleIds.map(roleId => ({ userId, roleId }))
            })
          }
          break

        case 'remove':
          await tx.userRole.deleteMany({
            where: { userId, roleId: { in: roleIds } }
          })
          break

        case 'replace':
          // Remove all existing roles
          await tx.userRole.deleteMany({
            where: { userId }
          })

          // Add new roles
          if (roleIds.length > 0) {
            await tx.userRole.createMany({
              data: roleIds.map(roleId => ({ userId, roleId }))
            })
          }
          break
      }
    })

    // Return updated user
    const updatedUser = await this.findById(userId)
    return updatedUser!
  }
}

export const userService = new UserService()