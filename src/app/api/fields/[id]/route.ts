// app/api/fields/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FieldService } from '@/server/services/field.service';
import type { ApiResponse, UpdateFieldDto } from '@/shared/types';
import { z } from 'zod';

const fieldService = new FieldService();

// GET /api/fields/[id] - Get a specific field
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const field = await fieldService.getFieldById(params.id);
    
    if (!field) {
      return NextResponse.json(
        { success: false, error: 'Field not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: field
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(`GET /api/fields/${params.id} error:`, error);
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to fetch field'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/fields/[id] - Update a specific field
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const updateFieldSchema = z.object({
      name: z.string().min(1).max(100).optional(),
      description: z.string().nullable().optional(),
      type: z.string().min(1).optional(),
      parent: z.string().nullable().optional(),
      values: z.array(z.string()).optional(),
      metadata: z.any().optional(),
      status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
      isRequired: z.boolean().optional(),
    });

    const validatedData = updateFieldSchema.parse(body);
    const field = await fieldService.updateField(params.id, validatedData);

    const response: ApiResponse = {
      success: true,
      data: field
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(`PUT /api/fields/${params.id} error:`, error);
    
    if (error.name === 'ZodError') {
      const response: ApiResponse = {
        success: false,
        error: error.errors.map((e: any) => e.message).join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to update field'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/fields/[id] - Delete a specific field
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await fieldService.deleteField(params.id);

    const response: ApiResponse = {
      success: true,
      data: { message: 'Field deleted successfully' }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(`DELETE /api/fields/${params.id} error:`, error);
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to delete field'
    };
    return NextResponse.json(response, { status: 500 });
  }
}