// src/components/users/userData.ts
// Frontend-only compatibility layer - NEVER imports from src/server/**

import { apiClient, ApiError } from '@/lib/api-client'
import type {
  User,
  Role,
  CreateUserDto,
  UpdateUserDto,
  CreateRoleDto,
  UpdateRoleDto,
  UserStatus,
  UserPaginationParams,
  PaginationParams
} from '@/shared/types'

// Re-export types for existing components (SAFE - from shared/)
export type { 
  User, 
  Role, 
  CreateUserDto, 
  UpdateUserDto, 
  CreateRoleDto, 
  UpdateRoleDto,
  UserStatus
}

// Enhanced error handling wrapper
function handleApiError(error: unknown, operation: string): never {
  if (error instanceof ApiError) {
    console.error(`${operation} failed:`, {
      message: error.message,
      status: error.status,
      code: error.code
    })
    throw new Error(`${operation} failed: ${error.message}`)
  }
  
  console.error(`${operation} unexpected error:`, error)
  throw new Error(`${operation} failed`)
}

// Users data service (backward compatibility)
export const usersData = {
  async getUsers(params?: UserPaginationParams): Promise<{ users: User[]; pagination: any }> {
    try {
      const response = await apiClient.getUsers(params)
      return {
        users: response.items,
        pagination: response.pagination
      }
    } catch (error) {
      handleApiError(error, 'Fetch users')
    }
  },

  async getUser(id: string): Promise<User> {
    try {
      return await apiClient.getUser(id)
    } catch (error) {
      handleApiError(error, 'Fetch user')
    }
  },

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return await apiClient.createUser(data)
    } catch (error) {
      handleApiError(error, 'Create user')
    }
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await apiClient.updateUser(id, data)
    } catch (error) {
      handleApiError(error, 'Update user')
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.deleteUser(id)
    } catch (error) {
      handleApiError(error, 'Delete user')
    }
  },

  async getUserRoles(userId: string): Promise<Role[]> {
    try {
      const response = await apiClient.getUserRoles(userId)
      return response.roles
    } catch (error) {
      handleApiError(error, 'Fetch user roles')
    }
  },

  async assignRolesToUser(userId: string, roleIds: string[]): Promise<User> {
    try {
      return await apiClient.manageUserRoles(userId, {
        roleIds,
        action: 'add'
      })
    } catch (error) {
      handleApiError(error, 'Assign roles to user')
    }
  },

  async removeRolesFromUser(userId: string, roleIds: string[]): Promise<User> {
    try {
      return await apiClient.manageUserRoles(userId, {
        roleIds,
        action: 'remove'
      })
    } catch (error) {
      handleApiError(error, 'Remove roles from user')
    }
  },

  async replaceUserRoles(userId: string, roleIds: string[]): Promise<User> {
    try {
      return await apiClient.manageUserRoles(userId, {
        roleIds,
        action: 'replace'
      })
    } catch (error) {
      handleApiError(error, 'Replace user roles')
    }
  }
}

// Roles data service (backward compatibility)
export const rolesData = {
  async getRoles(params?: PaginationParams): Promise<{ roles: Role[]; pagination: any }> {
    try {
      const response = await apiClient.getRoles(params)
      return {
        roles: response.items,
        pagination: response.pagination
      }
    } catch (error) {
      handleApiError(error, 'Fetch roles')
    }
  },

  async getRole(id: string): Promise<Role> {
    try {
      return await apiClient.getRole(id)
    } catch (error) {
      handleApiError(error, 'Fetch role')
    }
  },

  async createRole(data: CreateRoleDto): Promise<Role> {
    try {
      return await apiClient.createRole(data)
    } catch (error) {
      handleApiError(error, 'Create role')
    }
  },

  async updateRole(id: string, data: UpdateRoleDto): Promise<Role> {
    try {
      return await apiClient.updateRole(id, data)
    } catch (error) {
      handleApiError(error, 'Update role')
    }
  },

  async deleteRole(id: string): Promise<void> {
    try {
      await apiClient.deleteRole(id)
    } catch (error) {
      handleApiError(error, 'Delete role')
    }
  }
}

// Authentication service (backward compatibility)
export const authData = {
  async login(credentials: { email: string; password: string }): Promise<{
    success: boolean
    user?: any
    error?: string
  }> {
    try {
      const response = await apiClient.login(credentials)
      return {
        success: true,
        user: response.user
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message
        }
      }
      return {
        success: false,
        error: 'Login failed'
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.logout()
    } catch (error) {
      handleApiError(error, 'Logout')
    }
  }
}

// SAFE utility functions (with warnings for migration)
export const getAllUsers = async (): Promise<User[]> => {
  console.warn('getAllUsers() is deprecated. Use paginated loading for better performance.')
  
  try {
    // Safe approach: limit to 100 users max
    const response = await apiClient.getUsers({ limit: 100 })
    
    if (response.pagination.total > 100) {
      console.warn(`Warning: ${response.pagination.total} total users found, only showing first 100. Use pagination.`)
    }
    
    return response.items
  } catch (error) {
    handleApiError(error, 'Fetch all users')
  }
}

export const getAllRoles = async (): Promise<Role[]> => {
  console.warn('getAllRoles() is deprecated. Use paginated loading for better performance.')
  
  try {
    // Safe approach: limit to 100 roles max
    const response = await apiClient.getRoles({ limit: 100 })
    
    if (response.pagination.total > 100) {
      console.warn(`Warning: ${response.pagination.total} total roles found, only showing first 100. Use pagination.`)
    }
    
    return response.items
  } catch (error) {
    handleApiError(error, 'Fetch all roles')
  }
}

// Default export for backward compatibility
const userData = {
  users: usersData,
  roles: rolesData,
  auth: authData,
  getAllUsers,
  getAllRoles
}

export default userData