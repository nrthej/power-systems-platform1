// src/app/api/test/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/server/services/user.service'
import type { ApiResponse, PaginatedUsers } from '@/shared/types'

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedUsers>>> {
  // DEVELOPMENT ONLY - NO AUTHENTICATION CHECK
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      error: 'Test endpoints disabled in production'
    }, { status: 403 })
  }

  try {
    const result = await userService.findMany({ page: 1, limit: 100 })
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}