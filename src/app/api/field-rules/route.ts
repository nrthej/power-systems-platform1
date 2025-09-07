// app/api/field-rules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FieldService } from '@/server/services/field.service';
import type { ApiResponse, CreateFieldRuleDto } from '@/shared/types';
import { z } from 'zod';

const fieldService = new FieldService();

// GET /api/field-rules - Get all field rules
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
    const projectId = searchParams.get('projectId') || undefined;

    const rules = await fieldService.getFieldRules({ projectId });

    const response: ApiResponse = {
      success: true,
      data: rules
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('GET /api/field-rules error:', error);
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to fetch field rules'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/field-rules - Create a new field rule
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
    const createFieldRuleSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      conditionField: z.string().min(1, 'Condition field is required'),
      operator: z.enum(['=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains', 'in', 'not_in']),
      value: z.string().min(1, 'Value is required'),
      action: z.enum(['Clear', 'Hide', 'Disable', 'Enable', 'Modify', 'Require', 'Optional']),
      targetField: z.string().min(1, 'Target field is required'),
      actionValue: z.string().optional(),
      priority: z.number().int().min(0).max(1000).optional().default(0),
      projectId: z.string().nullable().optional(),
    });

    const validatedData = createFieldRuleSchema.parse(body);
    const rule = await fieldService.createFieldRule(validatedData);

    const response: ApiResponse = {
      success: true,
      data: rule
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/field-rules error:', error);
    
    if (error.name === 'ZodError') {
      const response: ApiResponse = {
        success: false,
        error: error.errors.map((e: any) => e.message).join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to create field rule'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// app/api/field-rules/[id]/route.ts
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
    const updateFieldRuleSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      conditionField: z.string().min(1).optional(),
      operator: z.enum(['=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains', 'in', 'not_in']).optional(),
      value: z.string().min(1).optional(),
      action: z.enum(['Clear', 'Hide', 'Disable', 'Enable', 'Modify', 'Require', 'Optional']).optional(),
      targetField: z.string().min(1).optional(),
      actionValue: z.string().optional(),
      priority: z.number().int().min(0).max(1000).optional(),
      isActive: z.boolean().optional(),
      projectId: z.string().nullable().optional(),
    });

    const validatedData = updateFieldRuleSchema.parse(body);
    const rule = await fieldService.updateFieldRule(params.id, validatedData);

    const response: ApiResponse = {
      success: true,
      data: rule
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(`PUT /api/field-rules/${params.id} error:`, error);
    
    if (error.name === 'ZodError') {
      const response: ApiResponse = {
        success: false,
        error: error.errors.map((e: any) => e.message).join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to update field rule'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

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

    await fieldService.deleteFieldRule(params.id);

    const response: ApiResponse = {
      success: true,
      data: { message: 'Field rule deleted successfully' }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(`DELETE /api/field-rules/${params.id} error:`, error);
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to delete field rule'
    };
    return NextResponse.json(response, { status: 500 });
  }
}