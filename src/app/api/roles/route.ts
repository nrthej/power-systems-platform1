// src/app/api/roles/route.ts
// API route - calls services only, NO Prisma imports

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/next-auth.config'
import { roleService } from '@/server/services/role.service'
import { paginationSchema, createRoleSchema } from '@/shared/schemas'
import type { ApiResponse, PaginatedRoles, Role } from '@/shared/types'

// GET /api/roles - List roles with pagination
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedRoles>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    // Validate pagination parameters
    const validatedParams = paginationSchema.parse(params)
    
    // Get roles via service
    const result = await roleService.findMany(validatedParams)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get roles error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/roles - Create new role
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Role>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createRoleSchema.parse(body)
    
    // Create role via service
    const role = await roleService.create(validatedData)

    return NextResponse.json({
      success: true,
      data: role
    }, { status: 201 })
  } catch (error) {
    console.error('Create role error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({
          success: false,
          error: 'Invalid input data'
        }, { status: 400 })
      }
      
      if (error.message === 'Role name already exists') {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}