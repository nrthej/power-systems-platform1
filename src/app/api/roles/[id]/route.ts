// src/app/api/roles/[id]/route.ts
// API route - calls services only, NO Prisma imports

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/next-auth.config'
import { roleService } from '@/server/services/role.service'
import { idSchema, updateRoleSchema } from '@/shared/schemas'
import type { ApiResponse, Role } from '@/shared/types'

// GET /api/roles/[id] - Get specific role
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Role>>> {
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
    
    // Get role via service
    const role = await roleService.findById(validatedId)

    if (!role) {
      return NextResponse.json({
        success: false,
        error: 'Role not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: role
    })
  } catch (error) {
    console.error('Get role error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid role ID'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/roles/[id] - Update specific role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Role>>> {
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
    const validatedData = updateRoleSchema.parse(body)
    
    // Update role via service
    const role = await roleService.update(validatedId, validatedData)

    return NextResponse.json({
      success: true,
      data: role
    })
  } catch (error) {
    console.error('Update role error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({
          success: false,
          error: 'Invalid input data'
        }, { status: 400 })
      }
      
      if (error.message === 'Role not found') {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 404 })
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

// DELETE /api/roles/[id] - Delete specific role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
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
    
    // Delete role via service
    await roleService.delete(validatedId)

    return NextResponse.json({
      success: true,
      data: { message: 'Role deleted successfully' }
    })
  } catch (error) {
    console.error('Delete role error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({
          success: false,
          error: 'Invalid role ID'
        }, { status: 400 })
      }
      
      if (error.message === 'Role not found') {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 404 })
      }
      
      if (error.message.includes('Cannot delete role with assigned users')) {
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