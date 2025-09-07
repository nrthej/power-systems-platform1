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
  },
  {
    "id": "cmf9eu2pv000h9d8eeb8vhmid",
    "name": "FERC ID",
    "description": "Federal Energy Regulatory Commission identifier",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.563Z",
    "updatedAt": "2025-09-07T08:07:38.563Z"
  },
  {
    "id": "cmf9eu2pw000j9d8ezqvantel",
    "name": "Technology Type",
    "description": "Primary generation technology",
    "type": "Select",
    "parent": null,
    "values": [
      "Solar PV",
      "Wind Onshore",
      "Wind Offshore",
      "Hydroelectric",
      "Natural Gas",
      "Nuclear",
      "Coal",
      "Battery Storage",
      "Pumped Storage",
      "Geothermal",
      "Biomass",
      "Fuel Cell",
      "Hybrid Solar+Storage"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.565Z",
    "updatedAt": "2025-09-07T08:07:38.565Z"
  },
  {
    "id": "cmf9eu2py000l9d8e0520v44t",
    "name": "Nameplate Capacity (MW)",
    "description": "Maximum electrical output capacity in megawatts",
    "type": "Number",
    "parent": "Technology Type",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.566Z",
    "updatedAt": "2025-09-07T08:07:38.566Z"
  },
  {
    "id": "cmf9eu2pz000n9d8eliovsnd9",
    "name": "Net Capacity (MW)",
    "description": "Net electrical output after auxiliary loads",
    "type": "Number",
    "parent": "Nameplate Capacity (MW)",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.567Z",
    "updatedAt": "2025-09-07T08:07:38.567Z"
  },
  {
    "id": "cmf9eu2q0000p9d8ev2caivw0",
    "name": "Voltage Level (kV)",
    "description": "Interconnection voltage level",
    "type": "Select",
    "parent": null,
    "values": [
      "12.47",
      "25",
      "34.5",
      "69",
      "115",
      "138",
      "230",
      "345",
      "500",
      "765"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.568Z",
    "updatedAt": "2025-09-07T08:07:38.568Z"
  },
  {
    "id": "cmf9eu2q1000r9d8efxtb5p3q",
    "name": "Energy Storage Capacity (MWh)",
    "description": "Battery or storage capacity in megawatt-hours",
    "type": "Number",
    "parent": "Technology Type",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.570Z",
    "updatedAt": "2025-09-07T08:07:38.570Z"
  },
  {
    "id": "cmf9eu2q2000t9d8e51ex07hq",
    "name": "Storage Duration (Hours)",
    "description": "Duration of energy storage at rated power",
    "type": "Number",
    "parent": "Energy Storage Capacity (MWh)",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.570Z",
    "updatedAt": "2025-09-07T08:07:38.570Z"
  },
  {
    "id": "cmf9eu2q3000v9d8e6qdrw5w4",
    "name": "State/Province",
    "description": "Project location state or province",
    "type": "Select",
    "parent": null,
    "values": [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.571Z",
    "updatedAt": "2025-09-07T08:07:38.571Z"
  },
  {
    "id": "cmf9eu2q3000x9d8em6ztldsi",
    "name": "County",
    "description": "County or parish where project is located",
    "type": "Text",
    "parent": "State/Province",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.572Z",
    "updatedAt": "2025-09-07T08:07:38.572Z"
  },
  {
    "id": "cmf9eu2q5000z9d8e85j6ildt",
    "name": "Latitude",
    "description": "Geographic latitude coordinate",
    "type": "Number",
    "parent": "County",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.573Z",
    "updatedAt": "2025-09-07T08:07:38.573Z"
  },
  {
    "id": "cmf9eu2q500119d8e66yy9tz3",
    "name": "Longitude",
    "description": "Geographic longitude coordinate",
    "type": "Number",
    "parent": "County",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.574Z",
    "updatedAt": "2025-09-07T08:07:38.574Z"
  },
  {
    "id": "cmf9eu2q600139d8e39z6yy45",
    "name": "Land Area (Acres)",
    "description": "Total project footprint in acres",
    "type": "Number",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.574Z",
    "updatedAt": "2025-09-07T08:07:38.574Z"
  },
  {
    "id": "cmf9eu2q700159d8edpq2dq5z",
    "name": "Project Status",
    "description": "Current development phase",
    "type": "Select",
    "parent": null,
    "values": [
      "Conceptual",
      "Feasibility Study",
      "Environmental Review",
      "Permitting",
      "Financing",
      "Under Construction",
      "Commissioning",
      "Commercial Operation",
      "Decommissioning",
      "Cancelled"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.575Z",
    "updatedAt": "2025-09-07T08:07:38.575Z"
  },
  {
    "id": "cmf9eu2q700179d8eadbufn1d",
    "name": "Environmental Review Status",
    "description": "Environmental assessment progress",
    "type": "Select",
    "parent": "Project Status",
    "values": [
      "Not Started",
      "Scoping",
      "Draft EA/EIS",
      "Public Comment",
      "Final EA/EIS",
      "Record of Decision",
      "Complete"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.576Z",
    "updatedAt": "2025-09-07T08:07:38.576Z"
  },
  {
    "id": "cmf9eu2q800199d8esa1xa6eg",
    "name": "Interconnection Status",
    "description": "Grid interconnection application status",
    "type": "Select",
    "parent": null,
    "values": [
      "Pre-Application",
      "Queue Position",
      "System Impact Study",
      "Facilities Study",
      "Interconnection Agreement",
      "In Service"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.576Z",
    "updatedAt": "2025-09-07T08:07:38.576Z"
  },
  {
    "id": "cmf9eu2q9001b9d8eoftzrjzm",
    "name": "Permit Status",
    "description": "Construction and operating permit status",
    "type": "Select",
    "parent": null,
    "values": [
      "Not Required",
      "Application Submitted",
      "Under Review",
      "Approved",
      "Issued",
      "Expired"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.577Z",
    "updatedAt": "2025-09-07T08:07:38.577Z"
  },
  {
    "id": "cmf9eu2q9001d9d8eymm5xr72",
    "name": "Total Project Cost ($M)",
    "description": "Total capital expenditure in millions USD",
    "type": "Currency",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.578Z",
    "updatedAt": "2025-09-07T08:07:38.578Z"
  },
  {
    "id": "cmf9eu2qa001f9d8eipxdheqi",
    "name": "Cost per MW ($M/MW)",
    "description": "Capital cost per megawatt",
    "type": "Currency",
    "parent": "Total Project Cost ($M)",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.578Z",
    "updatedAt": "2025-09-07T08:07:38.578Z"
  },
  {
    "id": "cmf9eu2qb001h9d8eysp00ss2",
    "name": "Financing Status",
    "description": "Project financing arrangement status",
    "type": "Select",
    "parent": null,
    "values": [
      "Unfunded",
      "Seeking Financing",
      "Term Sheet",
      "Due Diligence",
      "Financial Close",
      "Fully Funded"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.579Z",
    "updatedAt": "2025-09-07T08:07:38.579Z"
  },
  {
    "id": "cmf9eu2qb001j9d8elz3qjcvn",
    "name": "PPA Status",
    "description": "Power Purchase Agreement status",
    "type": "Select",
    "parent": null,
    "values": [
      "No PPA",
      "LOI Signed",
      "Under Negotiation",
      "Executed",
      "Merchant",
      "Bilateral Contract"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.579Z",
    "updatedAt": "2025-09-07T08:07:38.579Z"
  },
  {
    "id": "cmf9eu2qc001l9d8eeh03sp5b",
    "name": "PPA Price ($/MWh)",
    "description": "Power purchase agreement price per MWh",
    "type": "Currency",
    "parent": "PPA Status",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.580Z",
    "updatedAt": "2025-09-07T08:07:38.580Z"
  },
  {
    "id": "cmf9eu2qc001n9d8ebwppub5f",
    "name": "Planned COD",
    "description": "Planned Commercial Operation Date",
    "type": "Date",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.581Z",
    "updatedAt": "2025-09-07T08:07:38.581Z"
  },
  {
    "id": "cmf9eu2qd001p9d8ehbgz639a",
    "name": "Construction Start Date",
    "description": "Actual or planned construction start",
    "type": "Date",
    "parent": "Planned COD",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.582Z",
    "updatedAt": "2025-09-07T08:07:38.582Z"
  },
  {
    "id": "cmf9eu2qe001r9d8eitx13jm5",
    "name": "Mechanical Completion Date",
    "description": "Equipment installation completion date",
    "type": "Date",
    "parent": "Construction Start Date",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.582Z",
    "updatedAt": "2025-09-07T08:07:38.582Z"
  },
  {
    "id": "cmf9eu2qe001t9d8egxv33ihk",
    "name": "Interconnection Date",
    "description": "Grid connection energization date",
    "type": "Date",
    "parent": "Mechanical Completion Date",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.583Z",
    "updatedAt": "2025-09-07T08:07:38.583Z"
  },
  {
    "id": "cmf9eu2qf001v9d8em2hzvunp",
    "name": "Developer",
    "description": "Primary project development company",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.583Z",
    "updatedAt": "2025-09-07T08:07:38.583Z"
  },
  {
    "id": "cmf9eu2qf001x9d8e96hjqai1",
    "name": "Owner",
    "description": "Asset owner or operating entity",
    "type": "Text",
    "parent": "Developer",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.584Z",
    "updatedAt": "2025-09-07T08:07:38.584Z"
  },
  {
    "id": "cmf9eu2qg001z9d8epqk14fa3",
    "name": "EPC Contractor",
    "description": "Engineering, Procurement, Construction contractor",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.585Z",
    "updatedAt": "2025-09-07T08:07:38.585Z"
  },
  {
    "id": "cmf9eu2qh00219d8eylgiccl9",
    "name": "Utility Company",
    "description": "Interconnecting transmission/distribution utility",
    "type": "Select",
    "parent": null,
    "values": [
      "PG&E",
      "SCE",
      "SDG&E",
      "ConEd",
      "PSEG",
      "Duke Energy",
      "NextEra Energy",
      "Dominion Energy",
      "Exelon",
      "American Electric Power",
      "Southern Company",
      "Xcel Energy",
      "PPL",
      "FirstEnergy",
      "Entergy"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.585Z",
    "updatedAt": "2025-09-07T08:07:38.585Z"
  },
  {
    "id": "cmf9eu2qh00239d8e68xmrv97",
    "name": "ISO/RTO",
    "description": "Independent System Operator or Regional Transmission Organization",
    "type": "Select",
    "parent": "Utility Company",
    "values": [
      "CAISO",
      "ERCOT",
      "PJM",
      "NYISO",
      "ISO-NE",
      "MISO",
      "SPP",
      "AESO",
      "IESO",
      "Non-ISO Utility"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": true,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.586Z",
    "updatedAt": "2025-09-07T08:07:38.586Z"
  },
  {
    "id": "cmf9eu2qi00259d8e65idbr3g",
    "name": "Capacity Factor (%)",
    "description": "Expected annual capacity factor percentage",
    "type": "Percentage",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.587Z",
    "updatedAt": "2025-09-07T08:07:38.587Z"
  },
  {
    "id": "cmf9eu2qj00279d8eszs1a6kc",
    "name": "Annual Generation (GWh)",
    "description": "Expected annual electricity generation",
    "type": "Number",
    "parent": "Capacity Factor (%)",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.587Z",
    "updatedAt": "2025-09-07T08:07:38.587Z"
  },
  {
    "id": "cmf9eu2ql00299d8exmgo6k9j",
    "name": "Heat Rate (Btu/kWh)",
    "description": "Thermal efficiency for fossil fuel plants",
    "type": "Number",
    "parent": "Technology Type",
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.589Z",
    "updatedAt": "2025-09-07T08:07:38.589Z"
  },
  {
    "id": "cmf9eu2ql002b9d8erwjyp5go",
    "name": "Emissions Rate (lbs CO2/MWh)",
    "description": "Carbon dioxide emissions per megawatt-hour",
    "type": "Number",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.590Z",
    "updatedAt": "2025-09-07T08:07:38.590Z"
  },
  {
    "id": "cmf9eu2qm002d9d8elymbngpb",
    "name": "Risk Level",
    "description": "Overall project risk assessment",
    "type": "Select",
    "parent": null,
    "values": [
      "Low",
      "Medium-Low",
      "Medium",
      "Medium-High",
      "High"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.590Z",
    "updatedAt": "2025-09-07T08:07:38.590Z"
  },
  {
    "id": "cmf9eu2qm002f9d8e1v5pbo2a",
    "name": "Insurance Status",
    "description": "Project insurance coverage status",
    "type": "Select",
    "parent": null,
    "values": [
      "Not Required",
      "In Process",
      "Bound",
      "Active",
      "Expired"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.591Z",
    "updatedAt": "2025-09-07T08:07:38.591Z"
  },
  {
    "id": "cmf9eu2qn002h9d8er08o5g4k",
    "name": "NERC Compliance Required",
    "description": "Subject to NERC reliability standards",
    "type": "Boolean",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.591Z",
    "updatedAt": "2025-09-07T08:07:38.591Z"
  },
  {
    "id": "cmf9eu2qo002j9d8e5dhnoh4a",
    "name": "Data Confidence Level",
    "description": "Reliability of project information",
    "type": "Select",
    "parent": null,
    "values": [
      "Low",
      "Medium",
      "High",
      "Verified"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.592Z",
    "updatedAt": "2025-09-07T08:07:38.592Z"
  },
  {
    "id": "cmf9eu2qo002l9d8eq4hjy14r",
    "name": "Last Updated By",
    "description": "User who last modified project data",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.593Z",
    "updatedAt": "2025-09-07T08:07:38.593Z"
  },
  {
    "id": "cmf9eu2qp002n9d8ekcc6b2qx",
    "name": "Data Source",
    "description": "Primary source of project information",
    "type": "Multi-Select",
    "parent": null,
    "values": [
      "Developer Direct",
      "Utility Filing",
      "ISO Queue",
      "Regulatory Filing",
      "News Media",
      "Industry Report",
      "Site Visit",
      "Public Records"
    ],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.593Z",
    "updatedAt": "2025-09-07T08:07:38.593Z"
  },
  {
    "id": "cmf9eu2qq002p9d8eka2t39ym",
    "name": "Notes",
    "description": "Additional project notes and comments",
    "type": "Text",
    "parent": null,
    "values": [],
    "metadata": null,
    "status": "ACTIVE",
    "isRequired": false,
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.594Z",
    "updatedAt": "2025-09-07T08:07:38.594Z"
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

const fieldTypes = [
  {
    "id": "cmf9eu2p600009d8exffqkmg3",
    "name": "Text",
    "description": "Single-line text input for names, codes, and short descriptions",
    "icon": "📝",
    "validation": {
      "maxLength": 255
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.538Z",
    "updatedAt": "2025-09-07T08:07:38.538Z"
  },
  {
    "id": "cmf9eu2pe00019d8e9hjo7azh",
    "name": "Number",
    "description": "Numeric input for capacity, voltage, costs, and measurements",
    "icon": "🔢",
    "validation": {
      "min": 0,
      "type": "number"
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.546Z",
    "updatedAt": "2025-09-07T08:07:38.546Z"
  },
  {
    "id": "cmf9eu2pf00029d8ekmnl6773",
    "name": "Date",
    "description": "Date picker for milestones, deadlines, and commissioning dates",
    "icon": "📅",
    "validation": {
      "type": "date"
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.547Z",
    "updatedAt": "2025-09-07T08:07:38.547Z"
  },
  {
    "id": "cmf9eu2pg00039d8e0qsxx0f8",
    "name": "Boolean",
    "description": "Yes/No toggle for status flags and conditions",
    "icon": "✅",
    "validation": {
      "type": "boolean"
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.548Z",
    "updatedAt": "2025-09-07T08:07:38.548Z"
  },
  {
    "id": "cmf9eu2ph00049d8enloz4djt",
    "name": "Select",
    "description": "Single-choice dropdown for standardized options",
    "icon": "📋",
    "validation": {
      "type": "select",
      "required": true
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.549Z",
    "updatedAt": "2025-09-07T08:07:38.549Z"
  },
  {
    "id": "cmf9eu2pi00059d8er0injd5u",
    "name": "Multi-Select",
    "description": "Multiple-choice selection for tags and categories",
    "icon": "🏷️",
    "validation": {
      "type": "multi-select"
    },
    "isSystem": true,
    "createdAt": "2025-09-07T08:07:38.550Z",
    "updatedAt": "2025-09-07T08:07:38.550Z"
  },
  {
    "id": "cmf9eu2pj00069d8e51hu73pm",
    "name": "Currency",
    "description": "Monetary values with currency symbols",
    "icon": "💰",
    "validation": {
      "min": 0,
      "type": "number",
      "format": "currency"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.551Z",
    "updatedAt": "2025-09-07T08:07:38.551Z"
  },
  {
    "id": "cmf9eu2pk00079d8ezj63v0ym",
    "name": "Percentage",
    "description": "Percentage values from 0-100%",
    "icon": "📊",
    "validation": {
      "max": 100,
      "min": 0,
      "type": "number",
      "format": "percentage"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.552Z",
    "updatedAt": "2025-09-07T08:07:38.552Z"
  },
  {
    "id": "cmf9eu2pl00089d8enjrsgkku",
    "name": "Email",
    "description": "Email address validation",
    "icon": "📧",
    "validation": {
      "type": "email"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.553Z",
    "updatedAt": "2025-09-07T08:07:38.553Z"
  },
  {
    "id": "cmf9eu2pm00099d8e6hu2twsd",
    "name": "URL",
    "description": "Website and document links",
    "icon": "🔗",
    "validation": {
      "type": "url"
    },
    "isSystem": false,
    "createdAt": "2025-09-07T08:07:38.554Z",
    "updatedAt": "2025-09-07T08:07:38.554Z"
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

const fieldRules = [
  {
    "id": "cmf9eu2qr002r9d8eb107hkmb",
    "name": "Solar PV Storage Capacity",
    "description": "Show storage fields only for Solar+Storage projects",
    "conditionField": "Technology Type",
    "operator": "=",
    "value": "Hybrid Solar+Storage",
    "action": "Enable",
    "targetField": "Energy Storage Capacity (MWh)",
    "actionValue": null,
    "priority": 100,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.595Z",
    "updatedAt": "2025-09-07T08:07:38.595Z"
  },
  {
    "id": "cmf9eu2qt002t9d8ew4dlx106",
    "name": "Storage Duration Requirement",
    "description": "Require storage duration when storage capacity is specified",
    "conditionField": "Energy Storage Capacity (MWh)",
    "operator": ">",
    "value": "0",
    "action": "Require",
    "targetField": "Storage Duration (Hours)",
    "actionValue": null,
    "priority": 90,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.598Z",
    "updatedAt": "2025-09-07T08:07:38.598Z"
  },
  {
    "id": "cmf9eu2qu002v9d8emsn756aa",
    "name": "Fossil Heat Rate",
    "description": "Show heat rate field for fossil fuel technologies",
    "conditionField": "Technology Type",
    "operator": "in",
    "value": "Natural Gas,Coal",
    "action": "Enable",
    "targetField": "Heat Rate (Btu/kWh)",
    "actionValue": null,
    "priority": 80,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.598Z",
    "updatedAt": "2025-09-07T08:07:38.598Z"
  },
  {
    "id": "cmf9eu2qv002x9d8e8ceiiwzh",
    "name": "Renewable Emissions",
    "description": "Hide emissions rate for renewable technologies",
    "conditionField": "Technology Type",
    "operator": "in",
    "value": "Solar PV,Wind Onshore,Wind Offshore,Hydroelectric,Geothermal",
    "action": "Hide",
    "targetField": "Emissions Rate (lbs CO2/MWh)",
    "actionValue": null,
    "priority": 85,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.599Z",
    "updatedAt": "2025-09-07T08:07:38.599Z"
  },
  {
    "id": "cmf9eu2qv002z9d8egf7hslfw",
    "name": "Operational Project COD",
    "description": "COD is required for commercial operation status",
    "conditionField": "Project Status",
    "operator": "=",
    "value": "Commercial Operation",
    "action": "Require",
    "targetField": "Planned COD",
    "actionValue": null,
    "priority": 95,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.600Z",
    "updatedAt": "2025-09-07T08:07:38.600Z"
  },
  {
    "id": "cmf9eu2qw00319d8etf9iwqoi",
    "name": "Construction Start Requirement",
    "description": "Construction start date required for active construction",
    "conditionField": "Project Status",
    "operator": "=",
    "value": "Under Construction",
    "action": "Require",
    "targetField": "Construction Start Date",
    "actionValue": null,
    "priority": 90,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.601Z",
    "updatedAt": "2025-09-07T08:07:38.601Z"
  },
  {
    "id": "cmf9eu2qx00339d8e40fz6iyx",
    "name": "Cancelled Project Permits",
    "description": "Hide permit fields for cancelled projects",
    "conditionField": "Project Status",
    "operator": "=",
    "value": "Cancelled",
    "action": "Disable",
    "targetField": "Permit Status",
    "actionValue": null,
    "priority": 100,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.602Z",
    "updatedAt": "2025-09-07T08:07:38.602Z"
  },
  {
    "id": "cmf9eu2qy00359d8egb6yzryh",
    "name": "PPA Price Requirement",
    "description": "PPA price required when PPA is executed",
    "conditionField": "PPA Status",
    "operator": "=",
    "value": "Executed",
    "action": "Require",
    "targetField": "PPA Price ($/MWh)",
    "actionValue": null,
    "priority": 80,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.602Z",
    "updatedAt": "2025-09-07T08:07:38.602Z"
  },
  {
    "id": "cmf9eu2qy00379d8ew54c3itw",
    "name": "Cost per MW Calculation",
    "description": "Calculate cost per MW when total cost is available",
    "conditionField": "Total Project Cost ($M)",
    "operator": ">",
    "value": "0",
    "action": "Enable",
    "targetField": "Cost per MW ($M/MW)",
    "actionValue": null,
    "priority": 70,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.603Z",
    "updatedAt": "2025-09-07T08:07:38.603Z"
  },
  {
    "id": "cmf9eu2qz00399d8euf33153c",
    "name": "County Requirement",
    "description": "County required when state is specified",
    "conditionField": "State/Province",
    "operator": "!=",
    "value": "",
    "action": "Require",
    "targetField": "County",
    "actionValue": null,
    "priority": 85,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.604Z",
    "updatedAt": "2025-09-07T08:07:38.604Z"
  },
  {
    "id": "cmf9eu2r0003b9d8e9y34ptgh",
    "name": "Coordinate Pairing",
    "description": "Longitude required when latitude is provided",
    "conditionField": "Latitude",
    "operator": "!=",
    "value": "",
    "action": "Require",
    "targetField": "Longitude",
    "actionValue": null,
    "priority": 75,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.604Z",
    "updatedAt": "2025-09-07T08:07:38.604Z"
  },
  {
    "id": "cmf9eu2r0003d9d8extaikgg9",
    "name": "Net Capacity Validation",
    "description": "Net capacity should not exceed nameplate capacity",
    "conditionField": "Nameplate Capacity (MW)",
    "operator": ">",
    "value": "0",
    "action": "Enable",
    "targetField": "Net Capacity (MW)",
    "actionValue": null,
    "priority": 90,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.605Z",
    "updatedAt": "2025-09-07T08:07:38.605Z"
  },
  {
    "id": "cmf9eu2r1003f9d8e9hgkcnvi",
    "name": "Large Generator NERC",
    "description": "NERC compliance required for large generators (>20 MW)",
    "conditionField": "Nameplate Capacity (MW)",
    "operator": ">",
    "value": "20",
    "action": "Modify",
    "targetField": "NERC Compliance Required",
    "actionValue": "true",
    "priority": 100,
    "isActive": true,
    "projectId": null,
    "createdAt": "2025-09-07T08:07:38.605Z",
    "updatedAt": "2025-09-07T08:07:38.605Z"
  }
];

async function seedFieldRules() {
  for (const obj of fieldRules) {
    await prisma.fieldRule.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
  console.log("✅ Seeded fieldRules");
}

async function main() {
  console.log("🌱 Starting seeds2...");
  await seedUsers();
  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
  await seedUserRoles();
  await seedFields();
  await seedFieldTypes();
  await seedFieldRules();
  console.log("🌱 Completed seeds2!");
}

main().catch(async (e) => {
  console.error("❌ Error:", e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
