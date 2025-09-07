// src/app/api/users/route.ts
// API route - calls services only, NO Prisma imports

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/next-auth.config'
import { userService } from '@/server/services/user.service'
import { userPaginationSchema, createUserSchema } from '@/shared/schemas'
import type { ApiResponse, PaginatedUsers, User } from '@/shared/types'

// GET /api/users - List users with pagination
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedUsers>>> {
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
    const validatedParams = userPaginationSchema.parse(params)
    
    // Get users via service
    const result = await userService.findMany(validatedParams)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get users error:', error)
    
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

// POST /api/users - Create new user
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<User>>> {
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
    const validatedData = createUserSchema.parse(body)
    
    // Create user via service
    const user = await userService.create(validatedData)

    return NextResponse.json({
      success: true,
      data: user
    }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({
          success: false,
          error: 'Invalid input data'
        }, { status: 400 })
      }
      
      if (error.message === 'Email already in use' || error.message === 'One or more roles not found') {
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