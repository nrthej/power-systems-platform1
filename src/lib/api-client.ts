// src/lib/api-client.ts
// Frontend API client - NEVER imports from src/server/**

import type {
    ApiResponse,
    User,
    Role,
    CreateUserDto,
    UpdateUserDto,
    CreateRoleDto,
    UpdateRoleDto,
    LoginDto,
    AuthResponse,
    PaginatedUsers,
    PaginatedRoles,
    UserPaginationParams,
    PaginationParams
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
  }
  
  // Export singleton instance
  export const apiClient = new ApiClient()
  
  // Export types for convenience
  export type {
    User,
    Role,
    CreateUserDto,
    UpdateUserDto,
    CreateRoleDto,
    UpdateRoleDto,
    LoginDto,
    AuthResponse,
    PaginatedUsers,
    PaginatedRoles,
    UserPaginationParams,
    PaginationParams,
    ApiResponse
  }