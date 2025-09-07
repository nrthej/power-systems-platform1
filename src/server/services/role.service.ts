// src/server/services/role.service.ts
// Server-only role business logic

import { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma'
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  PaginationParams,
  PaginatedRoles
} from '@/shared/types'

export class RoleService {
  // Transform Prisma role to frontend-safe Role type
  private transformRole(prismaRole: any): Role {
    return {
      id: prismaRole.id,
      name: prismaRole.name,
      description: prismaRole.description,
      color: prismaRole.color
    }
  }

  async findMany(params: PaginationParams): Promise<PaginatedRoles> {
    const { page = 1, limit = 10, search = '' } = params
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.RoleWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}

    // Execute queries
    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.role.count({ where })
    ])

    return {
      items: roles.map(role => this.transformRole(role)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async findById(id: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { id }
    })

    return role ? this.transformRole(role) : null
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { name }
    })

    return role ? this.transformRole(role) : null
  }

  async create(data: CreateRoleDto): Promise<Role> {
    // Check if role name already exists
    const existingRole = await this.findByName(data.name)
    if (existingRole) {
      throw new Error('Role name already exists')
    }

    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color || 'bg-blue-100 text-blue-800'
      }
    })

    return this.transformRole(role)
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    // Check if role exists
    const existingRole = await this.findById(id)
    if (!existingRole) {
      throw new Error('Role not found')
    }

    // Check name uniqueness if name is being changed
    if (data.name && data.name !== existingRole.name) {
      const nameExists = await this.findByName(data.name)
      if (nameExists) {
        throw new Error('Role name already exists')
      }
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        color: data.color
      }
    })

    return this.transformRole(updatedRole)
  }

  async delete(id: string): Promise<void> {
    // Check if role exists
    const role = await this.findById(id)
    if (!role) {
      throw new Error('Role not found')
    }

    // Check if role has users assigned
    const userCount = await prisma.userRole.count({
      where: { roleId: id }
    })

    if (userCount > 0) {
      throw new Error('Cannot delete role with assigned users. Remove all users from this role first.')
    }

    // Delete role and related data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete role permissions
      await tx.rolePermission.deleteMany({
        where: { roleId: id }
      })

      // Delete user roles (should be none at this point)
      await tx.userRole.deleteMany({
        where: { roleId: id }
      })

      // Delete role
      await tx.role.delete({
        where: { id }
      })
    })
  }

  async findAll(): Promise<Role[]> {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }
    })

    return roles.map(role => this.transformRole(role))
  }
}

export const roleService = new RoleService()