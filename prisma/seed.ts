import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = [
  {
    "id": "cmf8h5its00039dccwu5yxf16",
    "email": "john.manager@powertech.com",
    "name": "John Smith",
    "password": "$2b$12$GHNjRRXaM74AwEGGiHiF8.OlGy6c1qJ9ceKB3OaVlk/g2hsUoInTO",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    "status": "ACTIVE",
    "lastLogin": null,
    "createdAt": "2025-09-06T16:24:45.712Z",
    "updatedAt": "2025-09-06T16:24:45.712Z"
  },
  {
    "id": "cmf8h5iza00069dccppgvomi7",
    "email": "sarah.engineer@powertech.com",
    "name": "Sarah Johnson",
    "password": "$2b$12$Hzsz6acIWW5E8a86ASl/y.aUQggSQ9p3vqvrOBUbTCex.TqWt9Hm.",
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    "status": "ACTIVE",
    "lastLogin": null,
    "createdAt": "2025-09-06T16:24:45.910Z",
    "updatedAt": "2025-09-06T16:24:45.910Z"
  },
  {
    "id": "cmf8h5j4u00099dccra6b284v",
    "email": "mike.lead@powertech.com",
    "name": "Mike Wilson",
    "password": "$2b$12$h55fN46SitsnQzP9TY4AZu2A6/YsxeOOq6..h1jIgOnbJijn6i9gK",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
    "status": "ACTIVE",
    "lastLogin": null,
    "createdAt": "2025-09-06T16:24:46.110Z",
    "updatedAt": "2025-09-06T16:24:46.110Z"
  },
  {
    "id": "cmf8h5inr00009dcc9b6yccgw",
    "email": "admin@powertech.com",
    "name": "System Administrator",
    "password": "$2b$12$c/sBcKIXQKjt7FwUzbTvZe5x/r/oPeF/RRohMGDh/CDxTd7t1LZyS",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    "status": "ACTIVE",
    "lastLogin": "2025-09-07T21:28:47.143Z",
    "createdAt": "2025-09-06T16:24:45.495Z",
    "updatedAt": "2025-09-07T21:28:47.144Z"
  },
  {
    "id": "cmf8h5jac000e9dcc7445ju0o",
    "email": "lisa.analyst@powertech.com",
    "name": "Lisa Davis",
    "password": "$2b$12$KbPReuWaizEQMlKWkfILfeULOhJVa5vjzIxIBB8i9RBehFKD9DqOW",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    "status": "INACTIVE",
    "lastLogin": null,
    "createdAt": "2025-09-06T16:24:46.309Z",
    "updatedAt": "2025-09-07T02:09:23.026Z"
  }
];

async function seedUsers() {
  for (const obj of users) {
    await prisma.user.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded users");
}

const roles = [
  {
    "id": "cmf8h2p0m00019d73rlc36t9o",
    "name": "Manager",
    "description": "Project management access",
    "color": "bg-blue-100 text-blue-800",
    "createdAt": "2025-09-06T16:22:33.766Z",
    "updatedAt": "2025-09-06T16:22:33.766Z"
  },
  {
    "id": "cmf8h2p0n00029d73ges6lp2o",
    "name": "Engineer",
    "description": "Technical project access",
    "color": "bg-green-100 text-green-800",
    "createdAt": "2025-09-06T16:22:33.768Z",
    "updatedAt": "2025-09-06T16:22:33.768Z"
  },
  {
    "id": "cmf8h2p0p00039d73x8sv7cs9",
    "name": "Viewer",
    "description": "Read-only access",
    "color": "bg-gray-100 text-gray-800",
    "createdAt": "2025-09-06T16:22:33.769Z",
    "updatedAt": "2025-09-06T16:22:33.769Z"
  },
  {
    "id": "cmf8vmo0y00009ddr1oszn9sk",
    "name": "TestRole",
    "description": "Test Role",
    "color": "bg-gray-100 text-gray-800",
    "createdAt": "2025-09-06T23:10:00.226Z",
    "updatedAt": "2025-09-06T23:10:00.226Z"
  },
  {
    "id": "cmf8h2p0j00009d73vjimqpmc",
    "name": "Admin1",
    "description": "Full system access",
    "color": "bg-red-100 text-red-800",
    "createdAt": "2025-09-06T16:22:33.763Z",
    "updatedAt": "2025-09-06T23:11:13.710Z"
  },
  {
    "id": "cmf8xsfu900019ddrwwwp8ivk",
    "name": "TestRole2",
    "description": "vTestRole2",
    "color": "bg-purple-100 text-purple-800",
    "createdAt": "2025-09-07T00:10:28.785Z",
    "updatedAt": "2025-09-07T00:10:28.785Z"
  }
];

async function seedRoles() {
  for (const obj of roles) {
    await prisma.role.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded roles");
}

const permissions = [
  {
    "id": "cmf8h2ptb000l9d73cd2a5wxt",
    "name": "users.create",
    "description": "Create users",
    "resource": "users",
    "action": "CREATE",
    "createdAt": "2025-09-06T16:22:34.799Z"
  },
  {
    "id": "cmf8h2ptc000m9d73a52r7uwi",
    "name": "users.read",
    "description": "View user information",
    "resource": "users",
    "action": "READ",
    "createdAt": "2025-09-06T16:22:34.801Z"
  },
  {
    "id": "cmf8h2ptd000n9d73nw2za8gm",
    "name": "users.update",
    "description": "Update users",
    "resource": "users",
    "action": "UPDATE",
    "createdAt": "2025-09-06T16:22:34.801Z"
  },
  {
    "id": "cmf8h2pte000o9d732lsu3460",
    "name": "users.delete",
    "description": "Delete users",
    "resource": "users",
    "action": "DELETE",
    "createdAt": "2025-09-06T16:22:34.802Z"
  },
  {
    "id": "cmf8h2pte000p9d73hddw9ru6",
    "name": "roles.create",
    "description": "Create roles",
    "resource": "roles",
    "action": "CREATE",
    "createdAt": "2025-09-06T16:22:34.803Z"
  },
  {
    "id": "cmf8h2ptf000q9d73austa01t",
    "name": "roles.read",
    "description": "View role information",
    "resource": "roles",
    "action": "READ",
    "createdAt": "2025-09-06T16:22:34.804Z"
  },
  {
    "id": "cmf8h2ptg000r9d7371jw45y1",
    "name": "roles.update",
    "description": "Update roles",
    "resource": "roles",
    "action": "UPDATE",
    "createdAt": "2025-09-06T16:22:34.804Z"
  },
  {
    "id": "cmf8h2ptg000s9d737qdiebdt",
    "name": "roles.delete",
    "description": "Delete roles",
    "resource": "roles",
    "action": "DELETE",
    "createdAt": "2025-09-06T16:22:34.805Z"
  },
  {
    "id": "cmf8h2pth000t9d732ucvp4vv",
    "name": "projects.create",
    "description": "Create projects",
    "resource": "projects",
    "action": "CREATE",
    "createdAt": "2025-09-06T16:22:34.805Z"
  },
  {
    "id": "cmf8h2pth000u9d73f9dspjmu",
    "name": "projects.read",
    "description": "View projects",
    "resource": "projects",
    "action": "READ",
    "createdAt": "2025-09-06T16:22:34.806Z"
  },
  {
    "id": "cmf8h2pti000v9d73cgolj5ok",
    "name": "projects.update",
    "description": "Update projects",
    "resource": "projects",
    "action": "UPDATE",
    "createdAt": "2025-09-06T16:22:34.806Z"
  },
  {
    "id": "cmf8h2pti000w9d73u5f8swzs",
    "name": "projects.delete",
    "description": "Delete projects",
    "resource": "projects",
    "action": "DELETE",
    "createdAt": "2025-09-06T16:22:34.807Z"
  }
];

async function seedPermissions() {
  for (const obj of permissions) {
    await prisma.permission.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded permissions");
}

const rolePermissions = [
  {
    "id": "cmf8h2ptk000y9d73lota5k0h",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2ptb000l9d73cd2a5wxt"
  },
  {
    "id": "cmf8h2ptm00109d73vs2flvk3",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2ptc000m9d73a52r7uwi"
  },
  {
    "id": "cmf8h2ptn00129d73bgas2jxu",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2ptd000n9d73nw2za8gm"
  },
  {
    "id": "cmf8h2pto00149d73in2br201",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2pte000o9d732lsu3460"
  },
  {
    "id": "cmf8h2ptp00169d73jpup41h1",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2pte000p9d73hddw9ru6"
  },
  {
    "id": "cmf8h2ptq00189d73c18lws9t",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2ptf000q9d73austa01t"
  },
  {
    "id": "cmf8h2ptr001a9d73veyxd5gb",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2ptg000r9d7371jw45y1"
  },
  {
    "id": "cmf8h2ptr001c9d73ro2b769f",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2ptg000s9d737qdiebdt"
  },
  {
    "id": "cmf8h2pts001e9d73jpjg3rzh",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2pth000t9d732ucvp4vv"
  },
  {
    "id": "cmf8h2ptt001g9d73txowjmmm",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2pth000u9d73f9dspjmu"
  },
  {
    "id": "cmf8h2ptu001i9d73m5tl539t",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2pti000v9d73cgolj5ok"
  },
  {
    "id": "cmf8h2ptv001k9d73puyqxez3",
    "roleId": "cmf8h2p0j00009d73vjimqpmc",
    "permissionId": "cmf8h2pti000w9d73u5f8swzs"
  },
  {
    "id": "cmf8h2ptw001m9d73p54u62ab",
    "roleId": "cmf8h2p0m00019d73rlc36t9o",
    "permissionId": "cmf8h2ptc000m9d73a52r7uwi"
  },
  {
    "id": "cmf8h2ptx001o9d73vs5n9emd",
    "roleId": "cmf8h2p0m00019d73rlc36t9o",
    "permissionId": "cmf8h2ptb000l9d73cd2a5wxt"
  },
  {
    "id": "cmf8h2ptx001q9d733jpnvt7s",
    "roleId": "cmf8h2p0m00019d73rlc36t9o",
    "permissionId": "cmf8h2ptd000n9d73nw2za8gm"
  },
  {
    "id": "cmf8h2pty001s9d730hdqzmks",
    "roleId": "cmf8h2p0m00019d73rlc36t9o",
    "permissionId": "cmf8h2ptf000q9d73austa01t"
  },
  {
    "id": "cmf8h2ptz001u9d73jlbyr4am",
    "roleId": "cmf8h2p0m00019d73rlc36t9o",
    "permissionId": "cmf8h2pth000u9d73f9dspjmu"
  },
  {
    "id": "cmf8h2pu0001w9d73irtoubpy",
    "roleId": "cmf8h2p0m00019d73rlc36t9o",
    "permissionId": "cmf8h2pth000t9d732ucvp4vv"
  },
  {
    "id": "cmf8h2pu0001y9d73q6s1b2sq",
    "roleId": "cmf8h2p0m00019d73rlc36t9o",
    "permissionId": "cmf8h2pti000v9d73cgolj5ok"
  },
  {
    "id": "cmf8h2pu100209d73ngsinx7j",
    "roleId": "cmf8h2p0n00029d73ges6lp2o",
    "permissionId": "cmf8h2ptc000m9d73a52r7uwi"
  },
  {
    "id": "cmf8h2pu200229d732u8nezpl",
    "roleId": "cmf8h2p0n00029d73ges6lp2o",
    "permissionId": "cmf8h2pth000u9d73f9dspjmu"
  },
  {
    "id": "cmf8h2pu300249d73ena6oue0",
    "roleId": "cmf8h2p0n00029d73ges6lp2o",
    "permissionId": "cmf8h2pti000v9d73cgolj5ok"
  },
  {
    "id": "cmf8h2pu400269d73y92cz0kl",
    "roleId": "cmf8h2p0p00039d73x8sv7cs9",
    "permissionId": "cmf8h2ptc000m9d73a52r7uwi"
  },
  {
    "id": "cmf8h2pu500289d73j8kup1pl",
    "roleId": "cmf8h2p0p00039d73x8sv7cs9",
    "permissionId": "cmf8h2ptf000q9d73austa01t"
  },
  {
    "id": "cmf8h2pu6002a9d7347objrj8",
    "roleId": "cmf8h2p0p00039d73x8sv7cs9",
    "permissionId": "cmf8h2pth000u9d73f9dspjmu"
  }
];

async function seedRolePermissions() {
  for (const obj of rolePermissions) {
    await prisma.rolePermission.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded rolePermissions");
}

const userRoles = [
  {
    "id": "cmf8h5int00029dcc0n622bc9",
    "userId": "cmf8h5inr00009dcc9b6yccgw",
    "roleId": "cmf8h2p0j00009d73vjimqpmc"
  },
  {
    "id": "cmf8h5itt00059dccperhaqqn",
    "userId": "cmf8h5its00039dccwu5yxf16",
    "roleId": "cmf8h2p0m00019d73rlc36t9o"
  },
  {
    "id": "cmf8h5izb00089dcclebe6z3h",
    "userId": "cmf8h5iza00069dccppgvomi7",
    "roleId": "cmf8h2p0n00029d73ges6lp2o"
  },
  {
    "id": "cmf8h5j4v000b9dccpl37c99x",
    "userId": "cmf8h5j4u00099dccra6b284v",
    "roleId": "cmf8h2p0m00019d73rlc36t9o"
  },
  {
    "id": "cmf8h5j4w000d9dcc5bna6fd2",
    "userId": "cmf8h5j4u00099dccra6b284v",
    "roleId": "cmf8h2p0n00029d73ges6lp2o"
  },
  {
    "id": "cmf8h5jae000g9dcchuws20ad",
    "userId": "cmf8h5jac000e9dcc7445ju0o",
    "roleId": "cmf8h2p0p00039d73x8sv7cs9"
  }
];

async function seedUserRoles() {
  for (const obj of userRoles) {
    await prisma.userRole.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded userRoles");
}

const fieldTypes = [
  {
    "id": "cmf9eu2ou00009d8ejt3i2fzn",
    "name": "Text",
    "description": "Single-line text input for names, codes, and short descriptions",
    "icon": "📝",
    "validation": {
      "maxLength": 255
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.534Z",
    "updatedAt": "2025-09-07T08:07:38.534Z"
  },
  {
    "id": "cmf9eu2oz00019d8ed3m44lqm",
    "name": "Number",
    "description": "Numeric input for capacity, voltage, costs, and measurements",
    "icon": "🔢",
    "validation": {
      "type": "number",
      "min": 0
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.539Z",
    "updatedAt": "2025-09-07T08:07:38.539Z"
  },
  {
    "id": "cmf9eu2p100029d8e9sqj0utz",
    "name": "Date",
    "description": "Date picker for milestones, deadlines, and commissioning dates",
    "icon": "📅",
    "validation": {
      "type": "date"
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.541Z",
    "updatedAt": "2025-09-07T08:07:38.541Z"
  },
  {
    "id": "cmf9eu2p300039d8eobqhyj4y",
    "name": "Boolean",
    "description": "Yes/No toggle for status flags and conditions",
    "icon": "✅",
    "validation": {
      "type": "boolean"
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.543Z",
    "updatedAt": "2025-09-07T08:07:38.543Z"
  },
  {
    "id": "cmf9eu2p400049d8e7ijskruo",
    "name": "Select",
    "description": "Single-choice dropdown for standardized options",
    "icon": "📋",
    "validation": {
      "type": "select",
      "required": true
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.544Z",
    "updatedAt": "2025-09-07T08:07:38.544Z"
  },
  {
    "id": "cmf9eu2p600059d8e5zf8n5vy",
    "name": "Multi-Select",
    "description": "Multiple-choice selection for tags and categories",
    "icon": "🏷️",
    "validation": {
      "type": "multi-select"
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.546Z",
    "updatedAt": "2025-09-07T08:07:38.546Z"
  },
  {
    "id": "cmf9eu2p700069d8exbvlx0zj",
    "name": "Currency",
    "description": "Monetary values with currency symbols",
    "icon": "💰",
    "validation": {
      "type": "number",
      "min": 0,
      "format": "currency"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.547Z",
    "updatedAt": "2025-09-07T08:07:38.547Z"
  },
  {
    "id": "cmf9eu2p900079d8ec8y2gv0n",
    "name": "Percentage",
    "description": "Percentage values from 0-100%",
    "icon": "📊",
    "validation": {
      "type": "number",
      "min": 0,
      "max": 100,
      "format": "percentage"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.549Z",
    "updatedAt": "2025-09-07T08:07:38.549Z"
  },
  {
    "id": "cmf9eu2pb00089d8eo4h1mvmm",
    "name": "Email",
    "description": "Email address validation",
    "icon": "📧",
    "validation": {
      "type": "email"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.551Z",
    "updatedAt": "2025-09-07T08:07:38.551Z"
  },
  {
    "id": "cmf9eu2pd00099d8ea2k5fxm0",
    "name": "URL",
    "description": "Website and document links",
    "icon": "🔗",
    "validation": {
      "type": "url"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.553Z",
    "updatedAt": "2025-09-07T08:07:38.553Z"
  }
];

async function seedFieldTypes() {
  for (const obj of fieldTypes) {
    await prisma.fieldType.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded fieldTypes");
}

const fields = [
  {
    "id": "cmf9eu2po000b9d8ev251m1cu",
    "name": "Project Name",
    "description": "Official project name as registered with regulatory authorities",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.556Z",
    "updatedAt": "2025-09-07T08:07:38.556Z"
  },
  {
    "id": "cmf9eu2ps000d9d8e6hsipnij",
    "name": "Project Code",
    "description": "Unique internal project identifier (e.g., PWR-2024-001)",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.560Z",
    "updatedAt": "2025-09-07T08:07:38.560Z"
  },
  {
    "id": "cmf9eu2pt000f9d8ef4cbfdf2",
    "name": "Queue Number",
    "description": "Interconnection queue position number",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.561Z",
    "updatedAt": "2025-09-07T08:07:38.561Z"
  }
];

async function seedFields() {
  for (const obj of fields) {
    await prisma.field.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded fields");
}

// Main function that calls all seeding functions
async function main() {
  try {
    console.log('🌱 Seeding database...');
    
    await seedRoles();
    await seedUsers();
    await seedPermissions();
    await seedRolePermissions();
    await seedUserRoles();
    await seedFieldTypes();
    await seedFields();
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Export for use in other files
export async function seedData() {
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