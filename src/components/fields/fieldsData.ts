// src/components/fields/fieldsData.ts

export enum FieldType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER', 
    DATE = 'DATE',
    SELECT = 'SELECT',
    MULTI_SELECT = 'MULTI_SELECT',
    BOOLEAN = 'BOOLEAN',
    LOCATION = 'LOCATION',
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    CURRENCY = 'CURRENCY'
  }
  
  export enum EntityType {
    PROJECT = 'PROJECT',
    USER = 'USER', 
    ASSET = 'ASSET',
    GLOBAL = 'GLOBAL'
  }
  
  export enum FieldStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DEPRECATED = 'DEPRECATED'
  }
  
  export interface FieldValidation {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customValidation?: string;
  }
  
  export interface Field {
    id: string;
    name: string;                    // Internal name (snake_case)
    label: string;                   // Display label
    type: FieldType;
    description?: string;
    category: string;                // "Technical", "Financial", "Administrative"
    entityType: EntityType;
    isRequired: boolean;
    status: FieldStatus;
    displayOrder: number;
    validation?: FieldValidation;
    permissibleValues?: string[];    // For SELECT types
    parentFieldId?: string;          // For dependent fields
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    lastModifiedBy?: string;
  }
  
  export interface FieldCategory {
    id: string;
    name: string;
    description: string;
    color: string;
    fieldCount: number;
  }
  
  export interface FieldTypeInfo {
    type: FieldType;
    label: string;
    description: string;
    icon: string;
    validationOptions: string[];
    supportsPermissibleValues: boolean;
    supportsParentChild: boolean;
  }
  
  // Mock field categories
  export const mockFieldCategories: FieldCategory[] = [
    {
      id: 'technical',
      name: 'Technical',
      description: 'Power systems technical specifications',
      color: 'blue',
      fieldCount: 12
    },
    {
      id: 'financial',
      name: 'Financial',
      description: 'Cost and financial tracking fields',
      color: 'green',
      fieldCount: 8
    },
    {
      id: 'administrative',
      name: 'Administrative',
      description: 'Project management and admin fields',
      color: 'purple',
      fieldCount: 7
    },
    {
      id: 'regulatory',
      name: 'Regulatory',
      description: 'Compliance and regulatory fields',
      color: 'orange',
      fieldCount: 5
    }
  ];
  
  // Field type information
  export const fieldTypeInfo: FieldTypeInfo[] = [
    {
      type: FieldType.TEXT,
      label: 'Text',
      description: 'Single line text input',
      icon: 'Type',
      validationOptions: ['required', 'minLength', 'maxLength', 'pattern'],
      supportsPermissibleValues: false,
      supportsParentChild: false
    },
    {
      type: FieldType.SELECT,
      label: 'Select',
      description: 'Dropdown selection from predefined options',
      icon: 'List',
      validationOptions: ['required'],
      supportsPermissibleValues: true,
      supportsParentChild: true
    },
    {
      type: FieldType.NUMBER,
      label: 'Number',
      description: 'Numeric input with validation',
      icon: 'Hash',
      validationOptions: ['required', 'min', 'max'],
      supportsPermissibleValues: false,
      supportsParentChild: false
    },
    {
      type: FieldType.DATE,
      label: 'Date',
      description: 'Date picker input',
      icon: 'Calendar',
      validationOptions: ['required'],
      supportsPermissibleValues: false,
      supportsParentChild: false
    },
    {
      type: FieldType.BOOLEAN,
      label: 'Boolean',
      description: 'Yes/No or True/False toggle',
      icon: 'ToggleLeft',
      validationOptions: ['required'],
      supportsPermissibleValues: false,
      supportsParentChild: false
    },
    {
      type: FieldType.EMAIL,
      label: 'Email',
      description: 'Email address with validation',
      icon: 'Mail',
      validationOptions: ['required'],
      supportsPermissibleValues: false,
      supportsParentChild: false
    },
    {
      type: FieldType.LOCATION,
      label: 'Location',
      description: 'Geographic coordinates or address',
      icon: 'MapPin',
      validationOptions: ['required'],
      supportsPermissibleValues: false,
      supportsParentChild: false
    },
    {
      type: FieldType.CURRENCY,
      label: 'Currency',
      description: 'Monetary amount with currency formatting',
      icon: 'DollarSign',
      validationOptions: ['required', 'min', 'max'],
      supportsPermissibleValues: false,
      supportsParentChild: false
    }
  ];
  
  // Mock fields based on the Excel headers
  export const mockFields: Field[] = [
    {
      id: '1',
      name: 'fuel_type',
      label: 'Fuel Type',
      type: FieldType.SELECT,
      description: 'Primary fuel source for power generation',
      category: 'technical',
      entityType: EntityType.PROJECT,
      isRequired: true,
      status: FieldStatus.ACTIVE,
      displayOrder: 1,
      permissibleValues: ['Solar', 'Wind', 'Natural Gas', 'Coal', 'Nuclear', 'Hydro', 'Battery Storage'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-02-01T14:30:00Z',
      createdBy: 'admin@company.com'
    },
    {
      id: '2',
      name: 'capacity_mw',
      label: 'Capacity (MW)',
      type: FieldType.NUMBER,
      description: 'Total generation capacity in megawatts',
      category: 'technical',
      entityType: EntityType.PROJECT,
      isRequired: true,
      status: FieldStatus.ACTIVE,
      displayOrder: 2,
      validation: { min: 0.1, max: 5000 },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      createdBy: 'admin@company.com'
    },
    {
      id: '3',
      name: 'poi_voltage',
      label: 'POI Voltage (kV)',
      type: FieldType.SELECT,
      description: 'Point of interconnection voltage level',
      category: 'technical',
      entityType: EntityType.PROJECT,
      isRequired: true,
      status: FieldStatus.ACTIVE,
      displayOrder: 3,
      permissibleValues: ['4.16', '12.47', '25', '34.5', '69', '115', '138', '230', '345', '500', '765'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T16:45:00Z'
    },
    {
      id: '4',
      name: 'iso_region',
      label: 'ISO Region',
      type: FieldType.SELECT,
      description: 'Independent System Operator region',
      category: 'regulatory',
      entityType: EntityType.PROJECT,
      isRequired: true,
      status: FieldStatus.ACTIVE,
      displayOrder: 4,
      permissibleValues: ['PJM', 'NYISO', 'ISO-NE', 'MISO', 'SPP', 'ERCOT', 'CAISO', 'Non-ISO'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '5',
      name: 'interconnection_status',
      label: 'Interconnection Status',
      type: FieldType.MULTI_SELECT,
      description: 'Current interconnection study phases',
      category: 'regulatory',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 5,
      permissibleValues: ['Phase1/Feasibility Study', 'Phase2/SIS', 'Phase3/Facilities Study', 'LGIA Negotiation', 'LGIA Executed', 'Construction', 'Commercial Operation'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-25T09:15:00Z'
    },
    {
      id: '6',
      name: 'planned_cod',
      label: 'Planned COD',
      type: FieldType.DATE,
      description: 'Planned Commercial Operation Date',
      category: 'administrative',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 6,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '7',
      name: 'interconnection_facilities_cost',
      label: 'Interconnection Facilities Cost',
      type: FieldType.CURRENCY,
      description: 'Cost of interconnection facilities in USD',
      category: 'financial',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 7,
      validation: { min: 0, max: 100000000 },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '8',
      name: 'grid_network_upgrades',
      label: 'Grid Network Upgrades',
      type: FieldType.CURRENCY,
      description: 'Cost of required grid network upgrades',
      category: 'financial',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 8,
      validation: { min: 0, max: 500000000 },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '9',
      name: 'location',
      label: 'Project Location',
      type: FieldType.LOCATION,
      description: 'Geographic coordinates of the project site',
      category: 'administrative',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 9,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '10',
      name: 'project_manager',
      label: 'Project Manager',
      type: FieldType.TEXT,
      description: 'Name of the assigned project manager',
      category: 'administrative',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 10,
      validation: { maxLength: 100 },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '11',
      name: 'co_located',
      label: 'Co-Located',
      type: FieldType.BOOLEAN,
      description: 'Whether the project is co-located with other facilities',
      category: 'technical',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 11,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '12',
      name: 'admin_email_ids',
      label: 'Admin Email IDs',
      type: FieldType.EMAIL,
      description: 'Administrative contact email addresses',
      category: 'administrative',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.ACTIVE,
      displayOrder: 12,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '13',
      name: 'suspension_status',
      label: 'Suspension Status',
      type: FieldType.BOOLEAN,
      description: 'Whether the project is currently suspended',
      category: 'regulatory',
      entityType: EntityType.PROJECT,
      isRequired: false,
      status: FieldStatus.DEPRECATED,
      displayOrder: 13,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-02-10T11:20:00Z'
    }
  ];
  
  // Helper functions
  export const getFieldsByCategory = (category: string): Field[] => {
    return mockFields.filter(field => field.category === category);
  };
  
  export const getFieldsByType = (type: FieldType): Field[] => {
    return mockFields.filter(field => field.type === type);
  };
  
  export const getFieldsByEntityType = (entityType: EntityType): Field[] => {
    return mockFields.filter(field => field.entityType === entityType);
  };
  
  export const getActiveFields = (): Field[] => {
    return mockFields.filter(field => field.status === FieldStatus.ACTIVE);
  };
  
  export const getFieldStats = () => {
    const totalFields = mockFields.length;
    const activeFields = getActiveFields().length;
    const uniqueTypes = [...new Set(mockFields.map(f => f.type))].length;
    const uniqueCategories = [...new Set(mockFields.map(f => f.category))].length;
    
    return {
      totalFields,
      activeFields,
      fieldTypes: uniqueTypes,
      fieldCategories: uniqueCategories
    };
  };