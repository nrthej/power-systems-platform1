// src/app/api/users/[id]/route.ts
// API route - calls services only, NO Prisma imports

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/next-auth.config'
import { userService } from '@/server/services/user.service'
import { idSchema, updateUserSchema } from '@/shared/schemas'
import type { ApiResponse, User } from '@/shared/types'

// GET /api/users/[id] - Get specific user
export async function GET(
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
    
    // Get user via service
    const user = await userService.findById(validatedId)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get user error:', error)
    
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

// PUT /api/users/[id] - Update specific user
export async function PUT(
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
    const validatedData = updateUserSchema.parse(body)
    
    // Update user via service
    const user = await userService.update(validatedId, validatedData)

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Update user error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({
          success: false,
          error: 'Invalid input data'
        }, { status: 400 })
      }
      
      if (error.message === 'User not found') {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 404 })
      }
      
      if (error.message === 'Email already in use') {
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

// DELETE /api/users/[id] - Delete specific user
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
    
    // Prevent self-deletion
    if (session.user.id === validatedId) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete your own account'
      }, { status: 400 })
    }
    
    // Delete user via service
    await userService.delete(validatedId)

    return NextResponse.json({
      success: true,
      data: { message: 'User deleted successfully' }
    })
  } catch (error) {
    console.error('Delete user error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({
          success: false,
          error: 'Invalid user ID'
        }, { status: 400 })
      }
      
      if (error.message === 'User not found') {
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