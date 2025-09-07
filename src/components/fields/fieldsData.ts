export type Rule = {
    id: string;
    conditionField: string;
    operator: string;
    value: string;
    action: string;
    targetField: string;
  };
  
  export type Field = {
    id: string;
    name: string;
    description?: string;
    type: string;
    parent?: string | null;
    values?: string[];
    rules?: Rule[];
    status: 'Active' | 'Inactive';
  };
  
  export type FieldType = {
    id: string;
    name: string;
    description: string;
  };
  
  const initialFields: Field[] = [
    {
      id: '1',
      name: 'Project Name',
      description: 'The official name of the project',
      type: 'Text',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Fuel Type',
      description: 'Primary energy source',
      type: 'Select',
      values: ['Solar', 'Wind', 'Hydro', 'Gas'],
      status: 'Active',
    },
    {
      id: '3',
      name: 'Size (MW)',
      description: 'Installed capacity in MW',
      type: 'Number',
      parent: 'Fuel Type', // child of Fuel Type
      status: 'Active',
    },
    {
      id: '4',
      name: 'Queue Number',
      description: 'Unique project queue identifier',
      type: 'Text',
      status: 'Active',
    },
    {
      id: '5',
      name: 'Capacity (MW)',
      description: 'Allocated project capacity',
      type: 'Number',
      parent: 'Queue Number', // child of Queue
      status: 'Active',
    },
    {
      id: '6',
      name: 'Planned COD',
      description: 'Planned Commercial Operation Date',
      type: 'Date',
      rules: [
        {
          id: 'r1',
          conditionField: 'Fuel Type',
          operator: '=',
          value: 'Solar',
          action: 'Enable',
          targetField: 'Planned COD',
        }
      ],
      status: 'Active',
    },
    {
      id: '7',
      name: 'SSR Status',
      description: 'System Study Report status',
      type: 'Select',
      values: ['Pending', 'Approved', 'Rejected'],
      rules: [
        {
          id: 'r2',
          conditionField: 'SSR Status',
          operator: '=',
          value: 'Rejected',
          action: 'Disable',
          targetField: 'Queue Number',
        }
      ],
      status: 'Active',
    },
    {
      id: '8',
      name: 'Admin Emails',
      description: 'Project admin email contacts',
      type: 'Multi-Select',
      values: ['admin1@example.com', 'admin2@example.com'],
      rules: [
        {
          id: 'r3',
          conditionField: 'Project Name',
          operator: 'contains',
          value: 'Test',
          action: 'Hide',
          targetField: 'Admin Emails',
        }
      ],
      status: 'Active',
    }
  ];
  
  const initialTypes: FieldType[] = [
    { id: 't1', name: 'Text', description: 'Free-form text input' },
    { id: 't2', name: 'Number', description: 'Integer or decimal values' },
    { id: 't3', name: 'Date', description: 'Calendar date picker' },
    { id: 't4', name: 'Boolean', description: 'Yes/No toggle' },
    { id: 't5', name: 'Select', description: 'Dropdown with single choice' },
    { id: 't6', name: 'Multi-Select', description: 'Dropdown with multiple choices' },
  ];
  
  // Mock service like usersData
  export const fieldsData = {
    getFields: async ({ limit = 100 }: { limit?: number }) => {
      return { fields: initialFields.slice(0, limit) };
    },
    getFieldTypes: async () => {
      return { types: initialTypes };
    }
  };
  