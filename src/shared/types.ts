// src/shared/types.ts
// Frontend-safe types - NO Prisma imports allowed

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum FieldStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
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

// Field entities
export interface FieldType {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  validation?: any
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Field {
  id: string
  name: string
  description?: string | null
  type: string
  parent?: string | null
  values: string[]
  metadata?: any
  status: FieldStatus
  isRequired: boolean
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
  rules?: FieldRule[]
}

export interface FieldRule {
  id: string
  name?: string | null
  description?: string | null
  conditionField: string
  operator: string
  value: string
  action: string
  targetField: string
  actionValue?: string | null
  priority: number
  isActive: boolean
  projectId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string | null
  status: ProjectStatus
  startDate?: Date | null
  endDate?: Date | null
  createdAt: Date
  updatedAt: Date
  createdById: string
  fields?: ProjectField[]
  rules?: FieldRule[]
}

export interface ProjectField {
  id: string
  projectId: string
  fieldName: string
  value?: any
  isVisible: boolean
  isRequired: boolean
  order: number
  createdAt: Date
  updatedAt: Date
  field?: Field
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

export interface CreateFieldTypeDto {
  name: string
  description?: string
  icon?: string
  validation?: any
}

export interface UpdateFieldTypeDto {
  name?: string
  description?: string
  icon?: string
  validation?: any
}

export interface CreateFieldDto {
  name: string
  description?: string
  type: string
  parent?: string | null
  values?: string[]
  metadata?: any
  isRequired?: boolean
}

export interface UpdateFieldDto {
  name?: string
  description?: string
  type?: string
  parent?: string | null
  values?: string[]
  metadata?: any
  status?: FieldStatus
  isRequired?: boolean
}

export interface CreateFieldRuleDto {
  name?: string
  description?: string
  conditionField: string
  operator: string
  value: string
  action: string
  targetField: string
  actionValue?: string
  priority?: number
  projectId?: string | null
}

export interface UpdateFieldRuleDto {
  name?: string
  description?: string
  conditionField?: string
  operator?: string
  value?: string
  action?: string
  targetField?: string
  actionValue?: string
  priority?: number
  isActive?: boolean
  projectId?: string | null
}

export interface CreateProjectDto {
  name: string
  description?: string
  startDate?: Date
  endDate?: Date
}

export interface UpdateProjectDto {
  name?: string
  description?: string
  status?: ProjectStatus
  startDate?: Date
  endDate?: Date
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

export interface FieldPaginationParams extends PaginationParams {
  status?: FieldStatus
  type?: string
  hasRules?: boolean
  hasValues?: boolean
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
export type PaginatedFields = PaginatedResponse<Field>
export type PaginatedFieldTypes = PaginatedResponse<FieldType>
export type PaginatedFieldRules = PaginatedResponse<FieldRule>
export type PaginatedProjects = PaginatedResponse<Project>

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

// Import/Export types
export interface ImportFieldData {
  name: string
  description?: string
  type: string
  parent?: string
  values?: string[]
  status?: string
}

export interface ExportFieldConfig {
  format: 'csv' | 'excel' | 'json'
  fields: string[]
  includeRules: boolean
  includeValues: boolean
  groupBy?: string
}