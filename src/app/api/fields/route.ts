// app/api/fields/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FieldService } from '@/server/services/field.service';
import type { ApiResponse, CreateFieldDto, FieldPaginationParams } from '@/shared/types';
import { z } from 'zod';

const fieldService = new FieldService();

// GET /api/fields - Get all fields with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params: FieldPaginationParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') as any || undefined,
      type: searchParams.get('type') || undefined,
      hasRules: searchParams.get('hasRules') === 'true' ? true : 
                searchParams.get('hasRules') === 'false' ? false : undefined,
      hasValues: searchParams.get('hasValues') === 'true' ? true :
                 searchParams.get('hasValues') === 'false' ? false : undefined,
    };

    const result = await fieldService.getFields(params);

    const response: ApiResponse = {
      success: true,
      data: result
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('GET /api/fields error:', error);
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to fetch fields'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/fields - Create a new field
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
    const createFieldSchema = z.object({
      name: z.string().min(1, 'Field name is required').max(100),
      description: z.string().optional(),
      type: z.string().min(1, 'Field type is required'),
      parent: z.string().nullable().optional(),
      values: z.array(z.string()).optional().default([]),
      metadata: z.any().optional(),
      isRequired: z.boolean().optional().default(false),
    });

    const validatedData = createFieldSchema.parse(body);
    const field = await fieldService.createField(validatedData);

    const response: ApiResponse = {
      success: true,
      data: field
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/fields error:', error);
    
    if (error.name === 'ZodError') {
      const response: ApiResponse = {
        success: false,
        error: error.errors.map((e: any) => e.message).join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to create field'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/fields/bulk - Bulk create fields
export async function POST_BULK(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fields } = body;

    if (!Array.isArray(fields)) {
      return NextResponse.json(
        { success: false, error: 'Fields must be an array' },
        { status: 400 }
      );
    }

    const createdFields = await fieldService.bulkCreateFields(fields);

    const response: ApiResponse = {
      success: true,
      data: {
        created: createdFields.length,
        total: fields.length,
        fields: createdFields
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/fields/bulk error:', error);
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to create fields'
    };
    return NextResponse.json(response, { status: 500 });
  }
}