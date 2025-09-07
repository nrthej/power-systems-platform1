// src/lib/api-client.ts
// Frontend API client - NEVER imports from src/server/**

import type {
  ApiResponse,
  User,
  Role,
  Field,
  FieldType,
  CreateUserDto,
  UpdateUserDto,
  CreateRoleDto,
  UpdateRoleDto,
  CreateFieldDto,
  UpdateFieldDto,
  CreateFieldTypeDto,
  UpdateFieldTypeDto,
  LoginDto,
  AuthResponse,
  PaginatedUsers,
  PaginatedRoles,
  PaginatedFields,
  UserPaginationParams,
  PaginationParams,
  FieldPaginationParams
} from '@/shared/types'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseUrl = '/api'

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data: ApiResponse<T> = await response.json()

      if (!data.success) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data.error
        )
      }

      return data.data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof TypeError) {
        throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR')
      }
      
      throw new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR')
    }
  }

  // Authentication API
  async login(credentials: LoginDto): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  }

  // Users API
  async getUsers(params?: UserPaginationParams): Promise<PaginatedUsers> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status) searchParams.set('status', params.status)

    const query = searchParams.toString()
    return this.request<PaginatedUsers>(`/users${query ? `?${query}` : ''}`)
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  async getUserRoles(userId: string): Promise<{ roles: Role[] }> {
    return this.request<{ roles: Role[] }>(`/users/${userId}/roles`)
  }

  async manageUserRoles(
    userId: string,
    data: { roleIds: string[]; action: 'add' | 'remove' | 'replace' }
  ): Promise<User> {
    return this.request<User>(`/users/${userId}/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Roles API
  async getRoles(params?: PaginationParams): Promise<PaginatedRoles> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return this.request<PaginatedRoles>(`/roles${query ? `?${query}` : ''}`)
  }

  async getRole(id: string): Promise<Role> {
    return this.request<Role>(`/roles/${id}`)
  }

  async createRole(data: CreateRoleDto): Promise<Role> {
    return this.request<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRole(id: string, data: UpdateRoleDto): Promise<Role> {
    return this.request<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRole(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/roles/${id}`, {
      method: 'DELETE',
    })
  }

  // Fields API
  async getFields(params?: FieldPaginationParams): Promise<PaginatedFields> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.type) searchParams.set('type', params.type)
    if (params?.hasRules !== undefined) searchParams.set('hasRules', params.hasRules.toString())
    if (params?.hasValues !== undefined) searchParams.set('hasValues', params.hasValues.toString())

    const query = searchParams.toString()
    return this.request<PaginatedFields>(`/fields${query ? `?${query}` : ''}`)
  }

  async getField(id: string): Promise<Field> {
    return this.request<Field>(`/fields/${id}`)
  }

  async createField(data: CreateFieldDto): Promise<Field> {
    return this.request<Field>('/fields', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateField(id: string, data: UpdateFieldDto): Promise<Field> {
    return this.request<Field>(`/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteField(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/fields/${id}`, {
      method: 'DELETE',
    })
  }

  async bulkCreateFields(data: { fields: CreateFieldDto[] }): Promise<{ created: number; total: number; fields: Field[] }> {
    return this.request<{ created: number; total: number; fields: Field[] }>('/fields/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Field Types API
  async getFieldTypes(): Promise<FieldType[]> {
    return this.request<FieldType[]>('/field-types')
  }

  async createFieldType(data: CreateFieldTypeDto): Promise<FieldType> {
    return this.request<FieldType>('/field-types', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateFieldType(id: string, data: UpdateFieldTypeDto): Promise<FieldType> {
    return this.request<FieldType>(`/field-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteFieldType(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/field-types/${id}`, {
      method: 'DELETE',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for convenience
export type {
  User,
  Role,
  Field,
  FieldType,
  CreateUserDto,
  UpdateUserDto,
  CreateRoleDto,
  UpdateRoleDto,
  CreateFieldDto,
  UpdateFieldDto,
  CreateFieldTypeDto,
  UpdateFieldTypeDto,
  LoginDto,
  AuthResponse,
  PaginatedUsers,
  PaginatedRoles,
  PaginatedFields,
  UserPaginationParams,
  PaginationParams,
  FieldPaginationParams,
  ApiResponse
}