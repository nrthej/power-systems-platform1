// components/projects/projectsData.ts
import type { Project, ProjectStatus, ProjectUserRole, PaginatedProjects, CreateProjectDto, UpdateProjectDto, ProjectPaginationParams } from '@/shared/types';

// Mock project data
const mockProjects: Project[] = [
  {
    id: 'proj_001',
    name: 'Solar Farm Texas Phase 1',
    description: 'Large-scale solar photovoltaic installation in West Texas with 500MW capacity and battery storage integration.',
    status: 'ACTIVE' as ProjectStatus,
    startDate: new Date('2024-03-15'),
    endDate: new Date('2025-12-31'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-09-01'),
    createdById: 'user_admin',
    createdBy: {
      id: 'user_admin',
      name: 'System Administrator',
      email: 'admin@powertech.com',
      status: 'ACTIVE' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: []
    },
    projectUsers: [
      {
        id: 'pu_001',
        userId: 'user_admin',
        projectId: 'proj_001',
        role: 'ADMIN' as ProjectUserRole,
        assignedAt: new Date('2024-01-10'),
        user: {
          id: 'user_admin',
          name: 'System Administrator',
          email: 'admin@powertech.com',
          status: 'ACTIVE' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: []
        }
      },
      {
        id: 'pu_002',
        userId: 'user_manager',
        projectId: 'proj_001',
        role: 'PROJECT_MANAGER' as ProjectUserRole,
        assignedAt: new Date('2024-01-15'),
        user: {
          id: 'user_manager',
          name: 'John Smith',
          email: 'john.manager@powertech.com',
          status: 'ACTIVE' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: []
        }
      }
    ]
  },
  {
    id: 'proj_002',
    name: 'Wind Farm Oklahoma',
    description: 'Offshore wind energy project with 200MW capacity featuring advanced turbine technology.',
    status: 'PLANNING' as ProjectStatus,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2026-08-30'),
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-09-05'),
    createdById: 'user_admin',
    createdBy: {
      id: 'user_admin',
      name: 'System Administrator',
      email: 'admin@powertech.com',
      status: 'ACTIVE' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: []
    },
    projectUsers: []
  },
  {
    id: 'proj_003',
    name: 'Hydroelectric Plant Modernization',
    description: 'Upgrade existing hydroelectric facility with new turbines and control systems to increase efficiency by 25%.',
    status: 'ON_HOLD' as ProjectStatus,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-05-31'),
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-08-10'),
    createdById: 'user_engineer',
    createdBy: {
      id: 'user_engineer',
      name: 'Sarah Johnson',
      email: 'sarah.engineer@powertech.com',
      status: 'ACTIVE' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: []
    },
    projectUsers: [
      {
        id: 'pu_004',
        userId: 'user_engineer',
        projectId: 'proj_003',
        role: 'PROJECT_MANAGER' as ProjectUserRole,
        assignedAt: new Date('2024-02-14'),
        user: {
          id: 'user_engineer',
          name: 'Sarah Johnson',
          email: 'sarah.engineer@powertech.com',
          status: 'ACTIVE' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: []
        }
      }
    ]
  },
  {
    id: 'proj_004',
    name: 'Battery Storage California',
    description: 'Grid-scale battery energy storage system for peak demand management and renewable energy integration.',
    status: 'COMPLETED' as ProjectStatus,
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-07-15'),
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2024-07-20'),
    createdById: 'user_manager',
    createdBy: {
      id: 'user_manager',
      name: 'Mike Wilson',
      email: 'mike.lead@powertech.com',
      status: 'ACTIVE' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: []
    },
    projectUsers: [
      {
        id: 'pu_005',
        userId: 'user_manager',
        projectId: 'proj_004',
        role: 'ADMIN' as ProjectUserRole,
        assignedAt: new Date('2023-06-05'),
        user: {
          id: 'user_manager',
          name: 'Mike Wilson',
          email: 'mike.lead@powertech.com',
          status: 'ACTIVE' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: []
        }
      }
    ]
  },
  {
    id: 'proj_005',
    name: 'Nuclear Plant Inspection',
    description: 'Comprehensive safety inspection and regulatory compliance assessment of nuclear power facility.',
    status: 'CANCELLED' as ProjectStatus,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-30'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-02-28'),
    createdById: 'user_admin',
    createdBy: {
      id: 'user_admin',
      name: 'System Administrator',
      email: 'admin@powertech.com',
      status: 'ACTIVE' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: []
    },
    projectUsers: []
  }
];

// Mock assigned field names for each project
const mockProjectFields: Record<string, string[]> = {
  'proj_001': [
    'Project Name', 'Project Code', 'Technology Type', 'Nameplate Capacity (MW)',
    'State/Province', 'County', 'Project Status', 'Planned COD', 'Developer',
    'Total Project Cost ($M)', 'PPA Status', 'Capacity Factor (%)'
  ],
  'proj_002': [
    'Project Name', 'Project Code', 'Technology Type', 'Nameplate Capacity (MW)',
    'State/Province', 'Project Status', 'Developer', 'Planned COD'
  ],
  'proj_003': [
    'Project Name', 'Technology Type', 'Nameplate Capacity (MW)', 'State/Province',
    'County', 'Project Status', 'Developer', 'Total Project Cost ($M)'
  ],
  'proj_004': [
    'Project Name', 'Project Code', 'Technology Type', 'Energy Storage Capacity (MWh)',
    'Storage Duration (Hours)', 'State/Province', 'Project Status', 'Developer'
  ],
  'proj_005': [
    'Project Name', 'Technology Type', 'State/Province', 'Project Status'
  ]
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const projectsData = {
  // Get projects with pagination and filtering
  async getProjects(params: ProjectPaginationParams = {}): Promise<PaginatedProjects> {
    await delay(300); // Simulate network delay

    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      createdById,
      hasFields
    } = params;

    let filteredProjects = [...mockProjects];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.createdBy.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }

    // Apply creator filter
    if (createdById) {
      filteredProjects = filteredProjects.filter(project => project.createdById === createdById);
    }

    // Apply hasFields filter
    if (hasFields !== undefined) {
      filteredProjects = filteredProjects.filter(project => {
        const fieldCount = mockProjectFields[project.id]?.length || 0;
        return hasFields ? fieldCount > 0 : fieldCount === 0;
      });
    }

    // Apply pagination
    const total = filteredProjects.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredProjects.slice(startIndex, endIndex);

    // Add assigned fields to each project
    const projectsWithFields = items.map(project => ({
      ...project,
      assignedFields: mockProjectFields[project.id] || []
    }));

    return {
      items: projectsWithFields,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  // Get single project by ID
  async getProject(id: string): Promise<Project | null> {
    await delay(200);
    
    const project = mockProjects.find(p => p.id === id);
    if (!project) return null;

    return {
      ...project,
      assignedFields: mockProjectFields[id] || []
    };
  },

  // Create new project
  async createProject(data: CreateProjectDto): Promise<Project> {
    await delay(500);

    // Check if project name already exists
    const existingProject = mockProjects.find(p => 
      p.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingProject) {
      throw new Error('Project name already exists');
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: data.name,
      description: data.description || null,
      status: data.status || 'PLANNING',
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: 'current_user_id', // Would come from session
      createdBy: {
        id: 'current_user_id',
        name: 'Current User',
        email: 'current@user.com',
        status: 'ACTIVE' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: []
      },
      projectUsers: [],
      assignedFields: data.fieldNames || []
    };

    // Add to mock data
    mockProjects.unshift(newProject);
    
    // Store assigned fields
    if (data.fieldNames && data.fieldNames.length > 0) {
      mockProjectFields[newProject.id] = data.fieldNames;
    }

    return newProject;
  },

  // Update existing project
  async updateProject(id: string, data: UpdateProjectDto): Promise<Project | null> {
    await delay(400);

    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) return null;

    // Check if new name conflicts with existing projects
    if (data.name) {
      const existingProject = mockProjects.find(p => 
        p.id !== id && p.name.toLowerCase() === data.name.toLowerCase()
      );
      if (existingProject) {
        throw new Error('Project name already exists');
      }
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...data,
      updatedAt: new Date()
    };

    mockProjects[projectIndex] = updatedProject;

    // Update assigned fields if provided
    if (data.fieldNames !== undefined) {
      mockProjectFields[id] = data.fieldNames;
      updatedProject.assignedFields = data.fieldNames;
    } else {
      updatedProject.assignedFields = mockProjectFields[id] || [];
    }

    return updatedProject;
  },

  // Delete project
  async deleteProject(id: string): Promise<boolean> {
    await delay(300);

    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) return false;

    mockProjects.splice(projectIndex, 1);
    delete mockProjectFields[id];
    
    return true;
  },

  // Get project statistics
  async getProjectStats() {
    await delay(100);

    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = mockProjects.filter(p => p.status === 'COMPLETED').length;
    const onHoldProjects = mockProjects.filter(p => p.status === 'ON_HOLD').length;

    return {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      onHold: onHoldProjects
    };
  },

  // Get assigned and unassigned fields for a project
  async getProjectFieldAssignments(projectId: string, allFields: string[] = []) {
    await delay(150);
    
    const assignedFields = mockProjectFields[projectId] || [];
    const unassignedFields = allFields.filter(field => !assignedFields.includes(field));

    return {
      assigned: assignedFields,
      unassigned: unassignedFields
    };
  },

  // Update field assignments for a project
  async updateProjectFields(projectId: string, fieldNames: string[]) {
    await delay(200);
    
    mockProjectFields[projectId] = fieldNames;
    
    // Update the project's updatedAt timestamp
    const projectIndex = mockProjects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
      mockProjects[projectIndex].updatedAt = new Date();
    }

    return true;
  }
};

// Export type for components
export type { Project, CreateProjectDto, UpdateProjectDto, ProjectPaginationParams };