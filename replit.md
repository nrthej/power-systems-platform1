# Power Systems Platform

## Overview

The Power Systems Platform is a comprehensive project management application built with Next.js and React, specifically designed for managing power systems projects. The platform provides user management, role-based access control, project organization, and a sophisticated field management system with custom field types and validation rules. It features a modern, responsive interface with real-time session management and a multi-modal data entry system for handling various types of project data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15.5.2 with React 19.1.0 using the App Router
- **Styling**: Tailwind CSS v4 with custom design system and color schemes
- **State Management**: React hooks pattern with custom hooks for API interactions
- **Authentication**: NextAuth.js v4 with session-based authentication
- **UI Components**: Custom component library with consistent design patterns
- **Animation**: Framer Motion for smooth transitions and interactions
- **Routing**: File-based routing with middleware for authentication protection

### Backend Architecture
- **API Routes**: Next.js API routes following RESTful conventions
- **Database ORM**: Prisma v6.15.0 for type-safe database operations
- **Authentication**: Custom credentials provider with bcrypt password hashing
- **Service Layer**: Organized business logic in service classes (UserService, RoleService, FieldService)
- **Validation**: Zod schemas for input validation and type safety
- **Session Management**: NextAuth with database session storage

### Data Storage Solutions
- **Primary Database**: Prisma-compatible database (configured for Postgres support)
- **Schema Design**: Comprehensive schema with users, roles, projects, fields, and relationships
- **Migration System**: Prisma migrations for schema version control
- **Seeding**: Automated database seeding for initial field types and system data

### Authentication and Authorization
- **Authentication Method**: Email/password credentials with bcrypt hashing
- **Session Management**: NextAuth sessions with database persistence
- **Authorization**: Role-based access control with user-role assignments
- **Middleware Protection**: Route-level protection for dashboard and admin areas
- **Password Security**: 12-round bcrypt hashing with secure salt generation

### Key Features Architecture
- **Field Management**: Dynamic field type system with custom validation rules
- **Project Management**: Multi-step project creation with team assignment workflows
- **User Management**: Complete CRUD operations with role assignment capabilities
- **Import/Export**: File-based data import/export with validation and preview
- **Real-time Validation**: Client-side and server-side validation with immediate feedback

## External Dependencies

### Core Framework Dependencies
- **Next.js**: Full-stack React framework for production applications
- **React/React-DOM**: Frontend library for building user interfaces
- **TypeScript**: Static type checking for enhanced developer experience

### Database and ORM
- **Prisma**: Database toolkit with type-safe client generation
- **@prisma/client**: Auto-generated database client with full type safety

### Authentication and Security
- **NextAuth.js**: Complete authentication solution for Next.js
- **@next-auth/prisma-adapter**: Prisma adapter for NextAuth session storage
- **bcryptjs**: Password hashing library for secure credential storage
- **jsonwebtoken**: JWT token generation and validation
- **Passport**: Authentication middleware with local and JWT strategies

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Modern icon library with consistent design
- **Framer Motion**: Animation library for smooth user interactions
- **Class Variance Authority**: Utility for building variant-based component APIs

### Validation and Type Safety
- **Zod**: Schema validation library for runtime type checking
- **Class Validator**: Decorator-based validation for DTOs
- **Class Transformer**: Object transformation utilities

### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Static type checking and enhanced IDE support
- **ts-node/tsx**: TypeScript execution for scripts and development

### Utility Libraries
- **clsx**: Conditional className utility for dynamic styling
- **tailwind-merge**: Utility for merging Tailwind CSS classes intelligently