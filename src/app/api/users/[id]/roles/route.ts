// src/app/api/users/[id]/roles/route.ts
// API route - calls services only, NO Prisma imports

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/next-auth.config'
import { userService } from '@/server/services/user.service'
import { idSchema, manageUserRolesSchema } from '@/shared/schemas'
import type { ApiResponse, User, Role } from '@/shared/types'

// GET /api/users/[id]/roles - Get user's roles
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<{ roles: Role[] }>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // Validate ID
    const validatedId = idSchema.parse(params.id)
    
    // Get user via service to extract roles
    const user = await userService.findById(validatedId)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { roles: user.roles }
    })
  } catch (error) {
    console.error('Get user roles error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/users/[id]/roles - Manage user roles
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // Validate ID
    const validatedId = idSchema.parse(params.id)
    
    const body = await request.json()
    
    // Validate input
    const { roleIds, action } = manageUserRolesSchema.parse(body)
    
    // Manage user roles via service
    const user = await userService.manageRoles(validatedId, roleIds, action)

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Manage user roles error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({
          success: false,
          error: 'Invalid input data'
        }, { status: 400 })
      }
      
      if (error.message === 'User not found' || error.message === 'One or more roles not found') {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 404 })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}