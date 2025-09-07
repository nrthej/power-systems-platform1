// src/shared/schemas.ts
// Shared Zod validation schemas

import { z } from 'zod'

// User validation
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
  avatar: z.string().url('Invalid URL').optional().or(z.literal('')).transform(val => val || undefined),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional().default('ACTIVE'),
  roleIds: z.array(z.string().cuid('Invalid role ID')).optional().default([])
})

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long').optional(),
  avatar: z.string().url('Invalid URL').optional().or(z.literal('')).transform(val => val || undefined),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
})

// Role validation
export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long'),
  description: z.string().max(200, 'Description too long').optional().or(z.literal('')).transform(val => val || undefined),
  color: z.string().regex(/^bg-.+ text-.+$/, 'Invalid color format').optional().default('bg-blue-100 text-blue-800')
})

export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long').optional(),
  description: z.string().max(200, 'Description too long').optional().or(z.literal('')).transform(val => val || undefined),
  color: z.string().regex(/^bg-.+ text-.+$/, 'Invalid color format').optional()
})

// Auth validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().max(100).optional().default('')
})

export const userPaginationSchema = paginationSchema.extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
})

// User role management
export const manageUserRolesSchema = z.object({
  roleIds: z.array(z.string().cuid('Invalid role ID')).min(1, 'At least one role ID required'),
  action: z.enum(['add', 'remove', 'replace'])
})

// ID validation
export const idSchema = z.string().cuid('Invalid ID format')

// Export inferred types
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type UserPaginationInput = z.infer<typeof userPaginationSchema>
export type ManageUserRolesInput = z.infer<typeof manageUserRolesSchema>