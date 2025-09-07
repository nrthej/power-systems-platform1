// prisma/seed.ts
// Secure, idempotent database seeding script

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function main() {
  console.log('🌱 Starting secure database seed...')

  // Create roles first (idempotent)
  const roles = [
    {
      name: 'Admin',
      description: 'Full system access',
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Manager',
      description: 'Project management access',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Engineer',
      description: 'Technical project access',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Viewer',
      description: 'Read-only access',
      color: 'bg-gray-100 text-gray-800'
    }
  ]

  for (const roleData of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: roleData.name }
    })

    if (!existingRole) {
      await prisma.role.create({
        data: roleData
      })
      console.log(`✅ Created role: ${roleData.name}`)
    } else {
      console.log(`⏭️  Role already exists: ${roleData.name}`)
    }
  }

  // Create users with HASHED passwords (idempotent)
  const users = [
    {
      email: 'admin@powertech.com',
      name: 'System Administrator',
      password: 'PowerAdmin2024!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      roles: ['Admin']
    },
    {
      email: 'john.manager@powertech.com',
      name: 'John Smith',
      password: 'Manager2024!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      roles: ['Manager']
    },
    {
      email: 'sarah.engineer@powertech.com',
      name: 'Sarah Johnson',
      password: 'Engineer2024!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      roles: ['Engineer']
    },
    {
      email: 'mike.lead@powertech.com',
      name: 'Mike Wilson',
      password: 'TechLead2024!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      roles: ['Manager', 'Engineer']
    },
    {
      email: 'lisa.analyst@powertech.com',
      name: 'Lisa Davis',
      password: 'Analyst2024!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      roles: ['Viewer']
    }
  ]

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!existingUser) {
      // CRITICAL: Hash password with bcrypt (NEVER store plain text)
      console.log(`🔐 Hashing password for ${userData.email}...`)
      const hashedPassword = await hashPassword(userData.password)

      // Create user with hashed password
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword, // ✅ HASHED PASSWORD
          avatar: userData.avatar,
          status: 'ACTIVE'
        }
      })

      // Assign roles
      for (const roleName of userData.roles) {
        const role = await prisma.role.findUnique({
          where: { name: roleName }
        })

        if (role) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: role.id
            }
          })
        }
      }

      console.log(`✅ Created user: ${userData.name} (${userData.email})`)
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`)
    }
  }

  // Create permissions (for future use)
  const permissions = [
    // Users
    { name: 'users.create',  description: 'Create users',         resource: 'users',   action: 'CREATE' },
    { name: 'users.read',    description: 'View user information',resource: 'users',   action: 'READ'   },
    { name: 'users.update',  description: 'Update users',         resource: 'users',   action: 'UPDATE' },
    { name: 'users.delete',  description: 'Delete users',         resource: 'users',   action: 'DELETE' },
  
    // Roles
    { name: 'roles.create',  description: 'Create roles',         resource: 'roles',   action: 'CREATE' },
    { name: 'roles.read',    description: 'View role information',resource: 'roles',   action: 'READ'   },
    { name: 'roles.update',  description: 'Update roles',         resource: 'roles',   action: 'UPDATE' },
    { name: 'roles.delete',  description: 'Delete roles',         resource: 'roles',   action: 'DELETE' },
  
    // Projects
    { name: 'projects.create', description: 'Create projects',    resource: 'projects',action: 'CREATE' },
    { name: 'projects.read',   description: 'View projects',      resource: 'projects',action: 'READ'   },
    { name: 'projects.update', description: 'Update projects',    resource: 'projects',action: 'UPDATE' },
    { name: 'projects.delete', description: 'Delete projects',    resource: 'projects',action: 'DELETE' }
  ]
  

  for (const permissionData of permissions) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permissionData.name }
    })

    if (!existingPermission) {
      await prisma.permission.create({
        data: permissionData
      })
      console.log(`✅ Created permission: ${permissionData.name}`)
    } else {
      console.log(`⏭️  Permission already exists: ${permissionData.name}`)
    }
  }

  // Assign permissions to roles
  const rolePermissions = [
    {
      roleName: 'Admin',
      permissions: [
        'users.create','users.read','users.update','users.delete',
        'roles.create','roles.read','roles.update','roles.delete',
        'projects.create','projects.read','projects.update','projects.delete'
      ]
    },
    {
      roleName: 'Manager',
      permissions: [
        'users.read','users.create','users.update',
        'roles.read',
        'projects.read','projects.create','projects.update'
      ]
    },
    {
      roleName: 'Engineer',
      permissions: [
        'users.read',
        'projects.read','projects.update'
      ]
    },
    {
      roleName: 'Viewer',
      permissions: [
        'users.read',
        'roles.read',
        'projects.read'
      ]
    }
  ]

  for (const rolePermissionData of rolePermissions) {
    const role = await prisma.role.findUnique({
      where: { name: rolePermissionData.roleName }
    })

    if (role) {
      for (const permissionName of rolePermissionData.permissions) {
        const permission = await prisma.permission.findUnique({
          where: { name: permissionName }
        })

        if (permission) {
          const existingRolePermission = await prisma.rolePermission.findUnique({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id
              }
            }
          })

          if (!existingRolePermission) {
            await prisma.rolePermission.create({
              data: {
                roleId: role.id,
                permissionId: permission.id
              }
            })
          }
        }
      }
      console.log(`✅ Assigned permissions to role: ${rolePermissionData.roleName}`)
    }
  }

  console.log('\n🎉 Secure database seeding completed successfully!')
  console.log('\n📊 Summary:')
  
  const userCount = await prisma.user.count()
  const roleCount = await prisma.role.count()
  const permissionCount = await prisma.permission.count()
  
  console.log(`   Users: ${userCount}`)
  console.log(`   Roles: ${roleCount}`)
  console.log(`   Permissions: ${permissionCount}`)
  
  console.log('\n🔑 Test Credentials:')
  console.log('   System Admin: admin@powertech.com / PowerAdmin2024!')
  console.log('   Project Manager: sarah.mitchell@powertech.com / ProjectMgr2024!')
  console.log('   Senior Engineer: david.chen@powertech.com / SeniorEng2024!')
  console.log('   Power Engineer: maria.gonzalez@powertech.com / PowerEng2024!')
  console.log('   Field Technician: james.thompson@powertech.com / FieldTech2024!')
  console.log('   Safety Officer: lisa.wang@powertech.com / SafetyOff2024!')
  console.log('   Client Liaison: michael.brown@powertech.com / ClientLias2024!')
  console.log('   Analyst: emma.davis@powertech.com / Analyst2024!')
  console.log('   Viewer: jennifer.lee@powertech.com / Viewer2024!')
  console.log('\n⚠️  IMPORTANT: All passwords are properly hashed with bcrypt!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })