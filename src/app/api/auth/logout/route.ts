// src/app/api/auth/logout/route.ts
// API route - calls services only, NO Prisma imports

import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/shared/types'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    // JWT-based logout is handled client-side
    // This endpoint exists for consistency and future server-side cleanup
    
    return NextResponse.json({
      success: true,
      data: { message: 'Logged out successfully' }
    })
  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}