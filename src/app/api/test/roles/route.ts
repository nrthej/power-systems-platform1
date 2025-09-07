// src/app/api/test/roles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { roleService } from '@/server/services/role.service'
import type { ApiResponse, PaginatedRoles } from '@/shared/types'

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedRoles>>> {
  // DEVELOPMENT ONLY - NO AUTHENTICATION CHECK
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      error: 'Test endpoints disabled in production'
    }, { status: 403 })
  }

  try {
    const result = await roleService.findMany({ page: 1, limit: 100 })
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get roles error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}