// server/services/field.service.ts
import { prisma } from '@/shared/database/prisma';
import type {
  Field,
  FieldType,
  FieldRule,
  CreateFieldDto,
  UpdateFieldDto,
  CreateFieldTypeDto,
  UpdateFieldTypeDto,
  CreateFieldRuleDto,
  UpdateFieldRuleDto,
  FieldPaginationParams,
  PaginatedFields,
  PaginatedFieldTypes,
  PaginatedFieldRules,
  FieldStatus
} from '@/shared/types';

export class FieldService {
  // Field CRUD operations
  async getFields(params: FieldPaginationParams = {}): Promise<PaginatedFields> {
    const {
      page = 1,
      limit = 50,
      search,
      status,
      type,
      hasRules,
      hasValues
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (hasRules === true) {
      where.rules = { some: {} };
    } else if (hasRules === false) {
      where.rules = { none: {} };
    }

    if (hasValues === true) {
      where.values = { isEmpty: false };
    } else if (hasValues === false) {
      where.values = { isEmpty: true };
    }

    const [fields, total] = await Promise.all([
      prisma.field.findMany({
        where,
        include: {
          fieldType: true,
          rules: {
            where: { isActive: true },
            include: {
              targetFieldRef: true
            }
          }
        },
        orderBy: [
          { isSystem: 'desc' }, // System fields first
          { name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.field.count({ where })
    ]);

    return {
      items: fields as Field[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getFieldById(id: string): Promise<Field | null> {
    const field = await prisma.field.findUnique({
      where: { id },
      include: {
        fieldType: true,
        rules: {
          where: { isActive: true },
          include: {
            targetFieldRef: true
          }
        }
      }
    });

    return field as Field | null;
  }

  async getFieldByName(name: string): Promise<Field | null> {
    const field = await prisma.field.findUnique({
      where: { name },
      include: {
        fieldType: true,
        rules: {
          where: { isActive: true },
          include: {
            targetFieldRef: true
          }
        }
      }
    });

    return field as Field | null;
  }

  async createField(data: CreateFieldDto): Promise<Field> {
    // Validate field type exists
    const fieldType = await prisma.fieldType.findUnique({
      where: { name: data.type }
    });

    if (!fieldType) {
      throw new Error(`Field type '${data.type}' does not exist`);
    }

    // Validate parent field exists if specified
    if (data.parent) {
      const parentField = await prisma.field.findUnique({
        where: { name: data.parent }
      });

      if (!parentField) {
        throw new Error(`Parent field '${data.parent}' does not exist`);
      }
    }

    // Check for duplicate field names
    const existingField = await prisma.field.findUnique({
      where: { name: data.name }
    });

    if (existingField) {
      throw new Error(`Field with name '${data.name}' already exists`);
    }

    const field = await prisma.field.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        parent: data.parent,
        values: data.values || [],
        metadata: data.metadata,
        isRequired: data.isRequired || false,
        status: 'ACTIVE'
      },
      include: {
        fieldType: true,
        rules: {
          where: { isActive: true },
          include: {
            targetFieldRef: true
          }
        }
      }
    });

    return field as Field;
  }

  async updateField(id: string, data: UpdateFieldDto): Promise<Field> {
    // Check if field exists
    const existingField = await prisma.field.findUnique({
      where: { id }
    });

    if (!existingField) {
      throw new Error('Field not found');
    }

    // Validate field type if changing
    if (data.type && data.type !== existingField.type) {
      const fieldType = await prisma.fieldType.findUnique({
        where: { name: data.type }
      });

      if (!fieldType) {
        throw new Error(`Field type '${data.type}' does not exist`);
      }
    }

    // Validate parent field if changing
    if (data.parent !== undefined && data.parent !== existingField.parent) {
      if (data.parent) {
        const parentField = await prisma.field.findUnique({
          where: { name: data.parent }
        });

        if (!parentField) {
          throw new Error(`Parent field '${data.parent}' does not exist`);
        }

        // Prevent circular references
        if (data.parent === existingField.name) {
          throw new Error('Field cannot be its own parent');
        }
      }
    }

    // Check for duplicate names if changing name
    if (data.name && data.name !== existingField.name) {
      const duplicateField = await prisma.field.findUnique({
        where: { name: data.name }
      });

      if (duplicateField) {
        throw new Error(`Field with name '${data.name}' already exists`);
      }
    }

    const field = await prisma.field.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.type && { type: data.type }),
        ...(data.parent !== undefined && { parent: data.parent }),
        ...(data.values !== undefined && { values: data.values }),
        ...(data.metadata !== undefined && { metadata: data.metadata }),
        ...(data.status && { status: data.status }),
        ...(data.isRequired !== undefined && { isRequired: data.isRequired })
      },
      include: {
        fieldType: true,
        rules: {
          where: { isActive: true },
          include: {
            targetFieldRef: true
          }
        }
      }
    });

    return field as Field;
  }

  async deleteField(id: string): Promise<void> {
    const field = await prisma.field.findUnique({
      where: { id },
      include: {
        rules: true,
        targetRules: true
      }
    });

    if (!field) {
      throw new Error('Field not found');
    }

    // Check if field is referenced by other fields as parent
    const childFields = await prisma.field.findMany({
      where: { parent: field.name }
    });

    if (childFields.length > 0) {
      throw new Error(`Cannot delete field '${field.name}' as it has ${childFields.length} child field(s)`);
    }

    // Soft delete by setting status to ARCHIVED instead of hard delete
    await prisma.field.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });
  }

  // Field Type CRUD operations
  async getFieldTypes(): Promise<FieldType[]> {
    const fieldTypes = await prisma.fieldType.findMany({
      orderBy: [
        { isSystem: 'desc' },
        { name: 'asc' }
      ]
    });

    return fieldTypes as FieldType[];
  }

  async createFieldType(data: CreateFieldTypeDto): Promise<FieldType> {
    const fieldType = await prisma.fieldType.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        validation: data.validation,
        isSystem: false
      }
    });

    return fieldType as FieldType;
  }

  async updateFieldType(id: string, data: UpdateFieldTypeDto): Promise<FieldType> {
    const fieldType = await prisma.fieldType.update({
      where: { id },
      data
    });

    return fieldType as FieldType;
  }

  async deleteFieldType(id: string): Promise<void> {
    // Check if field type is in use
    const fieldsUsingType = await prisma.field.findMany({
      where: { 
        type: {
          in: await prisma.fieldType.findUnique({
            where: { id },
            select: { name: true }
          }).then(ft => ft ? [ft.name] : [])
        }
      }
    });

    if (fieldsUsingType.length > 0) {
      throw new Error(`Cannot delete field type as it is used by ${fieldsUsingType.length} field(s)`);
    }

    await prisma.fieldType.delete({
      where: { id }
    });
  }

  // Field Rule CRUD operations
  async getFieldRules(params: { projectId?: string } = {}): Promise<FieldRule[]> {
    const { projectId } = params;

    const rules = await prisma.fieldRule.findMany({
      where: {
        isActive: true,
        ...(projectId && { projectId })
      },
      include: {
        sourceField: true,
        targetFieldRef: true,
        project: true
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    return rules as FieldRule[];
  }

  async createFieldRule(data: CreateFieldRuleDto): Promise<FieldRule> {
    // Validate source and target fields exist
    const [sourceField, targetField] = await Promise.all([
      prisma.field.findUnique({ where: { name: data.conditionField } }),
      prisma.field.findUnique({ where: { name: data.targetField } })
    ]);

    if (!sourceField) {
      throw new Error(`Source field '${data.conditionField}' does not exist`);
    }

    if (!targetField) {
      throw new Error(`Target field '${data.targetField}' does not exist`);
    }

    // Validate project exists if specified
    if (data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId }
      });

      if (!project) {
        throw new Error(`Project with ID '${data.projectId}' does not exist`);
      }
    }

    const rule = await prisma.fieldRule.create({
      data: {
        name: data.name,
        description: data.description,
        conditionField: data.conditionField,
        operator: data.operator,
        value: data.value,
        action: data.action,
        targetField: data.targetField,
        actionValue: data.actionValue,
        priority: data.priority || 0,
        projectId: data.projectId
      },
      include: {
        sourceField: true,
        targetFieldRef: true,
        project: true
      }
    });

    return rule as FieldRule;
  }

  async updateFieldRule(id: string, data: UpdateFieldRuleDto): Promise<FieldRule> {
    // Validate fields exist if changing
    if (data.conditionField || data.targetField) {
      const fieldsToCheck = [];
      if (data.conditionField) fieldsToCheck.push(data.conditionField);
      if (data.targetField) fieldsToCheck.push(data.targetField);

      const fields = await prisma.field.findMany({
        where: { name: { in: fieldsToCheck } }
      });

      if (fields.length !== fieldsToCheck.length) {
        throw new Error('One or more specified fields do not exist');
      }
    }

    const rule = await prisma.fieldRule.update({
      where: { id },
      data,
      include: {
        sourceField: true,
        targetFieldRef: true,
        project: true
      }
    });

    return rule as FieldRule;
  }

  async deleteFieldRule(id: string): Promise<void> {
    await prisma.fieldRule.delete({
      where: { id }
    });
  }

  // Bulk operations
  async bulkCreateFields(fieldsData: CreateFieldDto[]): Promise<Field[]> {
    const fields: Field[] = [];

    // Create fields sequentially to handle dependencies
    for (const fieldData of fieldsData) {
      try {
        const field = await this.createField(fieldData);
        fields.push(field);
      } catch (error) {
        // Log error but continue with other fields
        console.error(`Failed to create field '${fieldData.name}':`, error);
      }
    }

    return fields;
  }

  // Utility methods
  async getFieldChildren(fieldName: string): Promise<Field[]> {
    const children = await prisma.field.findMany({
      where: { 
        parent: fieldName,
        status: { not: 'ARCHIVED' }
      },
      include: {
        fieldType: true,
        rules: {
          where: { isActive: true }
        }
      }
    });

    return children as Field[];
  }

  async getFieldHierarchy(): Promise<Record<string, Field[]>> {
    const allFields = await prisma.field.findMany({
      where: { status: { not: 'ARCHIVED' } },
      include: {
        fieldType: true,
        rules: {
          where: { isActive: true }
        }
      }
    });

    const hierarchy: Record<string, Field[]> = {};
    
    // Group by parent (null for root fields)
    allFields.forEach(field => {
      const parentKey = field.parent || 'root';
      if (!hierarchy[parentKey]) {
        hierarchy[parentKey] = [];
      }
      hierarchy[parentKey].push(field as Field);
    });

    return hierarchy;
  }
}