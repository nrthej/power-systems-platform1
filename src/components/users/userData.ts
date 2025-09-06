export const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      roles: ['Admin', 'Project Manager'],
      status: 'Active',
      lastLogin: '2024-01-15 09:30',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      roles: ['Engineer'],
      status: 'Active',
      lastLogin: '2024-01-14 14:22',
      avatar: 'SW'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@company.com',
      roles: ['Viewer', 'Field Tech'],
      status: 'Inactive',
      lastLogin: '2024-01-10 11:15',
      avatar: 'MJ'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily@company.com',
      roles: ['Admin'],
      status: 'Active',
      lastLogin: '2024-01-15 16:45',
      avatar: 'EC'
    }
  ];
  
  export const mockRoles = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access and user management',
      permissions: ['Create', 'Read', 'Update', 'Delete', 'Manage Users'],
      userCount: 2,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 2,
      name: 'Project Manager',
      description: 'Manage projects and team assignments',
      permissions: ['Create Projects', 'Read', 'Update Projects', 'Assign Users'],
      userCount: 1,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      name: 'Engineer',
      description: 'Technical project access and reporting',
      permissions: ['Read', 'Update Projects', 'Create Reports'],
      userCount: 1,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      name: 'Field Tech',
      description: 'Field data collection and basic updates',
      permissions: ['Read', 'Update Field Data'],
      userCount: 1,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 5,
      name: 'Viewer',
      description: 'Read-only access to projects and reports',
      permissions: ['Read'],
      userCount: 1,
      color: 'bg-gray-100 text-gray-800'
    }
  ];