// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/bcrypt';

const prisma = new PrismaClient();

async function seedFieldTypes() {
  const fieldTypes = [
    {
      name: 'Text',
      description: 'Single-line text input for names, codes, and short descriptions',
      icon: '📝',
      isSystem: true,
      validation: { maxLength: 255 }
    },
    {
      name: 'Number',
      description: 'Numeric input for capacity, voltage, costs, and measurements',
      icon: '🔢',
      isSystem: true,
      validation: { type: 'number', min: 0 }
    },
    {
      name: 'Date',
      description: 'Date picker for milestones, deadlines, and commissioning dates',
      icon: '📅',
      isSystem: true,
      validation: { type: 'date' }
    },
    {
      name: 'Boolean',
      description: 'Yes/No toggle for status flags and conditions',
      icon: '✅',
      isSystem: true,
      validation: { type: 'boolean' }
    },
    {
      name: 'Select',
      description: 'Single-choice dropdown for standardized options',
      icon: '📋',
      isSystem: true,
      validation: { type: 'select', required: true }
    },
    {
      name: 'Multi-Select',
      description: 'Multiple-choice selection for tags and categories',
      icon: '🏷️',
      isSystem: true,
      validation: { type: 'multi-select' }
    },
    {
      name: 'Currency',
      description: 'Monetary values with currency symbols',
      icon: '💰',
      isSystem: false,
      validation: { type: 'number', min: 0, format: 'currency' }
    },
    {
      name: 'Percentage',
      description: 'Percentage values from 0-100%',
      icon: '📊',
      isSystem: false,
      validation: { type: 'number', min: 0, max: 100, format: 'percentage' }
    },
    {
      name: 'Email',
      description: 'Email address validation',
      icon: '📧',
      isSystem: false,
      validation: { type: 'email' }
    },
    {
      name: 'URL',
      description: 'Website and document links',
      icon: '🔗',
      isSystem: false,
      validation: { type: 'url' }
    }
  ];

  for (const fieldType of fieldTypes) {
    await prisma.fieldType.upsert({
      where: { name: fieldType.name },
      update: fieldType,
      create: fieldType
    });
  }

  console.log('✅ Field types seeded');
}

async function seedFieldsData() {  // RENAMED FROM seedFields to seedFieldsData
  const fields = [
    // Project Identification
    {
      name: 'Project Name',
      description: 'Official project name as registered with regulatory authorities',
      type: 'Text',
      isRequired: true,
      isSystem: true,
      values: []
    },
    {
      name: 'Project Code',
      description: 'Unique internal project identifier (e.g., PWR-2024-001)',
      type: 'Text',
      isRequired: true,
      isSystem: true,
      values: []
    },
    {
      name: 'Queue Number',
      description: 'Interconnection queue position number',
      type: 'Text',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'FERC ID',
      description: 'Federal Energy Regulatory Commission identifier',
      type: 'Text',
      isRequired: false,
      isSystem: false,
      values: []
    },

    // Technical Specifications
    {
      name: 'Technology Type',
      description: 'Primary generation technology',
      type: 'Select',
      isRequired: true,
      isSystem: false,
      values: [
        'Solar PV', 'Wind Onshore', 'Wind Offshore', 'Hydroelectric', 
        'Natural Gas', 'Nuclear', 'Coal', 'Battery Storage', 'Pumped Storage',
        'Geothermal', 'Biomass', 'Fuel Cell', 'Hybrid Solar+Storage'
      ]
    },
    {
      name: 'Nameplate Capacity (MW)',
      description: 'Maximum electrical output capacity in megawatts',
      type: 'Number',
      parent: 'Technology Type',
      isRequired: true,
      isSystem: false,
      values: []
    },
    {
      name: 'Net Capacity (MW)',
      description: 'Net electrical output after auxiliary loads',
      type: 'Number',
      parent: 'Nameplate Capacity (MW)',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Voltage Level (kV)',
      description: 'Interconnection voltage level',
      type: 'Select',
      isRequired: true,
      isSystem: false,
      values: ['12.47', '25', '34.5', '69', '115', '138', '230', '345', '500', '765']
    },
    {
      name: 'Energy Storage Capacity (MWh)',
      description: 'Battery or storage capacity in megawatt-hours',
      type: 'Number',
      parent: 'Technology Type',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Storage Duration (Hours)',
      description: 'Duration of energy storage at rated power',
      type: 'Number',
      parent: 'Energy Storage Capacity (MWh)',
      isRequired: false,
      isSystem: false,
      values: []
    },

    // Location & Geography
    {
      name: 'State/Province',
      description: 'Project location state or province',
      type: 'Select',
      isRequired: true,
      isSystem: false,
      values: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming'
      ]
    },
    {
      name: 'County',
      description: 'County or parish where project is located',
      type: 'Text',
      parent: 'State/Province',
      isRequired: true,
      isSystem: false,
      values: []
    },
    {
      name: 'Latitude',
      description: 'Geographic latitude coordinate',
      type: 'Number',
      parent: 'County',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Longitude',
      description: 'Geographic longitude coordinate',
      type: 'Number',
      parent: 'County',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Land Area (Acres)',
      description: 'Total project footprint in acres',
      type: 'Number',
      isRequired: false,
      isSystem: false,
      values: []
    },

    // Regulatory & Permits
    {
      name: 'Project Status',
      description: 'Current development phase',
      type: 'Select',
      isRequired: true,
      isSystem: false,
      values: [
        'Conceptual', 'Feasibility Study', 'Environmental Review',
        'Permitting', 'Financing', 'Under Construction', 'Commissioning',
        'Commercial Operation', 'Decommissioning', 'Cancelled'
      ]
    },
    {
      name: 'Environmental Review Status',
      description: 'Environmental assessment progress',
      type: 'Select',
      parent: 'Project Status',
      isRequired: false,
      isSystem: false,
      values: [
        'Not Started', 'Scoping', 'Draft EA/EIS', 'Public Comment',
        'Final EA/EIS', 'Record of Decision', 'Complete'
      ]
    },
    {
      name: 'Interconnection Status',
      description: 'Grid interconnection application status',
      type: 'Select',
      isRequired: true,
      isSystem: false,
      values: [
        'Pre-Application', 'Queue Position', 'System Impact Study',
        'Facilities Study', 'Interconnection Agreement', 'In Service'
      ]
    },
    {
      name: 'Permit Status',
      description: 'Construction and operating permit status',
      type: 'Select',
      isRequired: false,
      isSystem: false,
      values: [
        'Not Required', 'Application Submitted', 'Under Review',
        'Approved', 'Issued', 'Expired'
      ]
    },

    // Financial Information
    {
      name: 'Total Project Cost ($M)',
      description: 'Total capital expenditure in millions USD',
      type: 'Currency',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Cost per MW ($M/MW)',
      description: 'Capital cost per megawatt',
      type: 'Currency',
      parent: 'Total Project Cost ($M)',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Financing Status',
      description: 'Project financing arrangement status',
      type: 'Select',
      isRequired: false,
      isSystem: false,
      values: [
        'Unfunded', 'Seeking Financing', 'Term Sheet', 'Due Diligence',
        'Financial Close', 'Fully Funded'
      ]
    },
    {
      name: 'PPA Status',
      description: 'Power Purchase Agreement status',
      type: 'Select',
      isRequired: false,
      isSystem: false,
      values: [
        'No PPA', 'LOI Signed', 'Under Negotiation', 'Executed',
        'Merchant', 'Bilateral Contract'
      ]
    },
    {
      name: 'PPA Price ($/MWh)',
      description: 'Power purchase agreement price per MWh',
      type: 'Currency',
      parent: 'PPA Status',
      isRequired: false,
      isSystem: false,
      values: []
    },

    // Schedule & Milestones
    {
      name: 'Planned COD',
      description: 'Planned Commercial Operation Date',
      type: 'Date',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Construction Start Date',
      description: 'Actual or planned construction start',
      type: 'Date',
      parent: 'Planned COD',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Mechanical Completion Date',
      description: 'Equipment installation completion date',
      type: 'Date',
      parent: 'Construction Start Date',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Interconnection Date',
      description: 'Grid connection energization date',
      type: 'Date',
      parent: 'Mechanical Completion Date',
      isRequired: false,
      isSystem: false,
      values: []
    },

    // Stakeholders & Contacts
    {
      name: 'Developer',
      description: 'Primary project development company',
      type: 'Text',
      isRequired: true,
      isSystem: false,
      values: []
    },
    {
      name: 'Owner',
      description: 'Asset owner or operating entity',
      type: 'Text',
      parent: 'Developer',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'EPC Contractor',
      description: 'Engineering, Procurement, Construction contractor',
      type: 'Text',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Utility Company',
      description: 'Interconnecting transmission/distribution utility',
      type: 'Select',
      isRequired: true,
      isSystem: false,
      values: [
        'PG&E', 'SCE', 'SDG&E', 'ConEd', 'PSEG', 'Duke Energy',
        'NextEra Energy', 'Dominion Energy', 'Exelon', 'American Electric Power',
        'Southern Company', 'Xcel Energy', 'PPL', 'FirstEnergy', 'Entergy'
      ]
    },
    {
      name: 'ISO/RTO',
      description: 'Independent System Operator or Regional Transmission Organization',
      type: 'Select',
      parent: 'Utility Company',
      isRequired: true,
      isSystem: false,
      values: [
        'CAISO', 'ERCOT', 'PJM', 'NYISO', 'ISO-NE', 'MISO',
        'SPP', 'AESO', 'IESO', 'Non-ISO Utility'
      ]
    },

    // Performance & Operations
    {
      name: 'Capacity Factor (%)',
      description: 'Expected annual capacity factor percentage',
      type: 'Percentage',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Annual Generation (GWh)',
      description: 'Expected annual electricity generation',
      type: 'Number',
      parent: 'Capacity Factor (%)',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Heat Rate (Btu/kWh)',
      description: 'Thermal efficiency for fossil fuel plants',
      type: 'Number',
      parent: 'Technology Type',
      isRequired: false,
      isSystem: false,
      values: []
    },
    {
      name: 'Emissions Rate (lbs CO2/MWh)',
      description: 'Carbon dioxide emissions per megawatt-hour',
      type: 'Number',
      isRequired: false,
      isSystem: false,
      values: []
    },

    // Risk & Compliance
    {
      name: 'Risk Level',
      description: 'Overall project risk assessment',
      type: 'Select',
      isRequired: false,
      isSystem: false,
      values: ['Low', 'Medium-Low', 'Medium', 'Medium-High', 'High']
    },
    {
      name: 'Insurance Status',
      description: 'Project insurance coverage status',
      type: 'Select',
      isRequired: false,
      isSystem: false,
      values: ['Not Required', 'In Process', 'Bound', 'Active', 'Expired']
    },
    {
      name: 'NERC Compliance Required',
      description: 'Subject to NERC reliability standards',
      type: 'Boolean',
      isRequired: false,
      isSystem: false,
      values: []
    },

    // Additional Metadata
    {
      name: 'Data Confidence Level',
      description: 'Reliability of project information',
      type: 'Select',
      isRequired: false,
      isSystem: true,
      values: ['Low', 'Medium', 'High', 'Verified']
    },
    {
      name: 'Last Updated By',
      description: 'User who last modified project data',
      type: 'Text',
      isRequired: false,
      isSystem: true,
      values: []
    },
    {
      name: 'Data Source',
      description: 'Primary source of project information',
      type: 'Multi-Select',
      isRequired: false,
      isSystem: true,
      values: [
        'Developer Direct', 'Utility Filing', 'ISO Queue', 'Regulatory Filing',
        'News Media', 'Industry Report', 'Site Visit', 'Public Records'
      ]
    },
    {
      name: 'Notes',
      description: 'Additional project notes and comments',
      type: 'Text',
      isRequired: false,
      isSystem: false,
      values: []
    }
  ];

  for (const field of fields) {
    await prisma.field.upsert({
      where: { name: field.name },
      update: field,
      create: field
    });
  }

  console.log(`✅ ${fields.length} fields seeded`);
}

async function seedFieldRules() {
  const rules = [
    // Technology-based rules
    {
      name: 'Solar PV Storage Capacity',
      description: 'Show storage fields only for Solar+Storage projects',
      conditionField: 'Technology Type',
      operator: '=',
      value: 'Hybrid Solar+Storage',
      action: 'Enable',
      targetField: 'Energy Storage Capacity (MWh)',
      priority: 100
    },
    {
      name: 'Storage Duration Requirement',
      description: 'Require storage duration when storage capacity is specified',
      conditionField: 'Energy Storage Capacity (MWh)',
      operator: '>',
      value: '0',
      action: 'Require',
      targetField: 'Storage Duration (Hours)',
      priority: 90
    },
    {
      name: 'Fossil Heat Rate',
      description: 'Show heat rate field for fossil fuel technologies',
      conditionField: 'Technology Type',
      operator: 'in',
      value: 'Natural Gas,Coal',
      action: 'Enable',
      targetField: 'Heat Rate (Btu/kWh)',
      priority: 80
    },
    {
      name: 'Renewable Emissions',
      description: 'Hide emissions rate for renewable technologies',
      conditionField: 'Technology Type',
      operator: 'in',
      value: 'Solar PV,Wind Onshore,Wind Offshore,Hydroelectric,Geothermal',
      action: 'Hide',
      targetField: 'Emissions Rate (lbs CO2/MWh)',
      priority: 85
    },

    // Status-based rules
    {
      name: 'Operational Project COD',
      description: 'COD is required for commercial operation status',
      conditionField: 'Project Status',
      operator: '=',
      value: 'Commercial Operation',
      action: 'Require',
      targetField: 'Planned COD',
      priority: 95
    },
    {
      name: 'Construction Start Requirement',
      description: 'Construction start date required for active construction',
      conditionField: 'Project Status',
      operator: '=',
      value: 'Under Construction',
      action: 'Require',
      targetField: 'Construction Start Date',
      priority: 90
    },
    {
      name: 'Cancelled Project Permits',
      description: 'Hide permit fields for cancelled projects',
      conditionField: 'Project Status',
      operator: '=',
      value: 'Cancelled',
      action: 'Disable',
      targetField: 'Permit Status',
      priority: 100
    },

    // Financial rules
    {
      name: 'PPA Price Requirement',
      description: 'PPA price required when PPA is executed',
      conditionField: 'PPA Status',
      operator: '=',
      value: 'Executed',
      action: 'Require',
      targetField: 'PPA Price ($/MWh)',
      priority: 80
    },
    {
      name: 'Cost per MW Calculation',
      description: 'Calculate cost per MW when total cost is available',
      conditionField: 'Total Project Cost ($M)',
      operator: '>',
      value: '0',
      action: 'Enable',
      targetField: 'Cost per MW ($M/MW)',
      priority: 70
    },

    // Geographic rules
    {
      name: 'County Requirement',
      description: 'County required when state is specified',
      conditionField: 'State/Province',
      operator: '!=',
      value: '',
      action: 'Require',
      targetField: 'County',
      priority: 85
    },
    {
      name: 'Coordinate Pairing',
      description: 'Longitude required when latitude is provided',
      conditionField: 'Latitude',
      operator: '!=',
      value: '',
      action: 'Require',
      targetField: 'Longitude',
      priority: 75
    },

    // Capacity validation
    {
      name: 'Net Capacity Validation',
      description: 'Net capacity should not exceed nameplate capacity',
      conditionField: 'Nameplate Capacity (MW)',
      operator: '>',
      value: '0',
      action: 'Enable',
      targetField: 'Net Capacity (MW)',
      priority: 90
    },

    // NERC compliance
    {
      name: 'Large Generator NERC',
      description: 'NERC compliance required for large generators (>20 MW)',
      conditionField: 'Nameplate Capacity (MW)',
      operator: '>',
      value: '20',
      action: 'Modify',
      targetField: 'NERC Compliance Required',
      actionValue: 'true',
      priority: 100
    }
  ];

  for (const rule of rules) {
    await prisma.fieldRule.create({
      data: rule
    });
  }

  console.log(`✅ ${rules.length} field rules seeded`);
}

async function seedRoles() {
  const roles = [
    {
      name: 'Admin',
      description: 'System administrator with full access',
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Project Manager',
      description: 'Can manage projects and assign team members',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Engineer',
      description: 'Can view and edit technical project data',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Analyst',
      description: 'Can view and analyze project data',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Viewer',
      description: 'Read-only access to project information',
      color: 'bg-gray-100 text-gray-800'
    }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role
    });
  }

  console.log(`✅ ${roles.length} roles seeded`);
}

async function seedUsers() {
  // Get the Admin role
  const adminRole = await prisma.role.findUnique({
    where: { name: 'Admin' }
  });

  if (!adminRole) {
    throw new Error('Admin role not found. Please seed roles first.');
  }

  const hashedPassword = await hashPassword('PowerAdmin2024!');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@powertech.com' },
    update: {},
    create: {
      email: 'admin@powertech.com',
      name: 'System Administrator',
      password: hashedPassword,
      status: 'ACTIVE'
    }
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id
    }
  });

  console.log('✅ Admin user seeded with credentials:');
  console.log('   Email: admin@powertech.com');
  console.log('   Password: PowerAdmin2024!');
}

// Main function that calls all seeding functions
async function main() {
  try {
    console.log('🌱 Seeding database...');
    
    await seedRoles();
    await seedUsers();
    await seedFieldTypes();
    await seedFieldsData();
    await seedFieldRules();
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Export for use in other files
export async function seedFields() {
  return main();
}

// Run seeding if this file is executed directly
if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}