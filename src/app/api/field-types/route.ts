// app/api/field-types/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FieldService } from '@/server/services/field.service';
import type { ApiResponse, CreateFieldTypeDto } from '@/shared/types';
import { z } from 'zod';

const fieldService = new FieldService();

// GET /api/field-types - Get all field types
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const fieldTypes = await fieldService.getFieldTypes();

    const response: ApiResponse = {
      success: true,
      data: fieldTypes
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('GET /api/field-types error:', error);
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to fetch field types'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/field-types - Create a new field type
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const createFieldTypeSchema = z.object({
      name: z.string().min(1, 'Field type name is required').max(50),
      description: z.string().optional(),
      icon: z.string().optional(),
      validation: z.any().optional(),
    });

    const validatedData = createFieldTypeSchema.parse(body);
    const fieldType = await fieldService.createFieldType(validatedData);

    const response: ApiResponse = {
      success: true,
      data: fieldType
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/field-types error:', error);
    
    if (error.name === 'ZodError') {
      const response: ApiResponse = {
        success: false,
        error: error.errors.map((e: any) => e.message).join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to create field type'
    };
    return NextResponse.json(response, { status: 500 });
  }
}