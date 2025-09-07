// src/shared/types.ts
// Frontend-safe types - NO Prisma imports allowed

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
  }
  
  // Core entities
  export interface User {
    id: string
    email: string
    name: string
    avatar?: string | null
    status: UserStatus
    lastLogin?: Date | null
    createdAt: Date
    updatedAt: Date
    roles: Role[]
  }
  
  export interface Role {
    id: string
    name: string
    description?: string | null
    color: string
  }
  
  // API DTOs
  export interface CreateUserDto {
    email: string
    name: string
    password: string
    avatar?: string
    status?: UserStatus
    roleIds?: string[]
  }
  
  export interface UpdateUserDto {
    email?: string
    name?: string
    password?: string
    avatar?: string
    status?: UserStatus
  }
  
  export interface CreateRoleDto {
    name: string
    description?: string
    color?: string
  }
  
  export interface UpdateRoleDto {
    name?: string
    description?: string
    color?: string
  }
  
  export interface LoginDto {
    email: string
    password: string
  }
  
  // Pagination
  export interface PaginationParams {
    page?: number
    limit?: number
    search?: string
  }
  
  export interface UserPaginationParams extends PaginationParams {
    status?: UserStatus
  }
  
  export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // API Response format (MANDATORY)
  export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
  }
  
  // Paginated responses
  export interface PaginatedResponse<T> {
    items: T[]
    pagination: PaginationMeta
  }
  
  export type PaginatedUsers = PaginatedResponse<User>
  export type PaginatedRoles = PaginatedResponse<Role>
  
  // Auth responses
  export interface AuthUser {
    id: string
    email: string
    name: string
    avatar?: string | null
    status: UserStatus
    roles: Role[]
  }
  
  export interface AuthResponse {
    user: AuthUser
  }