# HRMS Architecture Blueprint

This document describes the current HRMS system architecture for `hrms_orga` and `hrms_orga_backend`.

## 1. System Overview

The platform is a multi-role HRMS built as two cooperating applications:

- `hrms_orga`: React + Vite frontend for admin, HR, manager, and employee workflows.
- `hrms_orga_backend`: Express + TypeScript + PostgreSQL backend exposing the business APIs.

The system covers:

- Authentication and role-based access
- Employee lifecycle management
- Attendance and face attendance
- Leave management
- Payroll and payroll configuration
- Recruitment and onboarding
- Department, designation, organization, and shift management
- Performance, training, and offboarding
- Document upload and storage
- Subscription and billing

## 2. High-Level Architecture

```text
Browser
  -> hrms_orga (React UI)
    -> hrms_orga_backend (REST API)
      -> PostgreSQL via Drizzle ORM
      -> File storage / upload services
      -> Email service
      -> Face recognition service
      -> Payment gateway integrations
```

The frontend is primarily a presentation and orchestration layer. The backend owns business logic, validation, persistence, and integrations.

## 3. Frontend Architecture

### 3.1 Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide icons
- jsPDF / pdf generation utilities

### 3.2 Frontend Structure

- `src/App.jsx`: route definitions and guarded app shells
- `src/service.js`: all HTTP API clients and shared frontend data mapping
- `src/components`: route guards, layouts, shared UI primitives
- `src/pages/hrms`: admin/HR workflows
- `src/pages/employee`: employee self-service workflows
- `src/pages/superadmin`: super-admin / platform management views
- `src/features/face-attendance`: face registration and attendance capture flow
- `src/utils`: formatting, auth helpers, seeded data, PDF utilities

### 3.3 Frontend Layering

The frontend is organized by feature and role:

- Route layer: page-level navigation and protected routes
- Feature layer: domain workflows such as face attendance
- Shared UI layer: layout, buttons, inputs, filters, modals
- Data layer: `service.js` API wrapper functions

### 3.4 Frontend Roles

- Admin/HR users manage organization data, employees, attendance, payroll, and settings.
- Employees handle their own attendance, leave, payroll, documents, profile, and support.
- Super admins manage broader platform-level views and organization oversight.

### 3.5 Frontend Data Flow

1. Page loads through React Router.
2. Protected route checks auth state.
3. Page calls `service.js` API methods.
4. API response is normalized in the frontend.
5. UI renders tables, cards, modals, dashboards, and detail panels.

## 4. Backend Architecture

### 4.1 Tech Stack

- Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- JWT authentication
- bcrypt password handling
- Multer / file upload support
- Nodemailer
- Razorpay integration

### 4.2 Backend Structure

- `src/server.ts`: server bootstrap
- `src/app.ts`: app composition and middleware
- `src/router.ts`: main router aggregation
- `src/router/*`: domain route registration
- `src/controllers/*`: HTTP request/response handlers
- `src/services/*`: business rules and orchestration
- `src/repository/*`: database access layer
- `src/db/schema.ts`: database schema definition
- `src/db/migrate.ts`: migration runner
- `src/middleware/auth.ts`: authentication and authorization
- `src/utils/*`: tokens, cookies, validation, payment helpers

### 4.3 Backend Layering

The backend uses a fairly clean three-layer structure:

- Controller layer: parses HTTP requests and returns responses
- Service layer: applies business rules and coordinates operations
- Repository layer: executes database queries

This separation is strongest in the HRMS backend and is the main reason it is the most complete project in the workspace.

## 5. Core Domains

### 5.1 Authentication and Authorization

Responsibilities:

- Login and registration
- JWT issuance and validation
- Role-based access control
- Protected routes for admin, employee, and superadmin

Backend areas:

- `src/controllers/authController.ts`
- `src/router/authRoutes.ts`
- `src/middleware/auth.ts`
- `src/services/userServices.ts`

### 5.2 Employee Management

Responsibilities:

- Create and maintain employee records
- Personal, employment, document, and activity data
- Employee list and employee detail views

Backend areas:

- `employeeController.ts`
- `employmentController.ts`
- `employee.repo.ts`
- `employment.repo.ts`
- `employeeServices.ts`
- `employmentServices.ts`

Frontend areas:

- `src/pages/hrms/Employee/*`
- `src/pages/hrms/OnboardedEmployeeList/*`

### 5.3 Attendance

Responsibilities:

- Admin-marked attendance
- Employee self attendance
- Attendance history and detail views
- Shift-aware check-in and check-out
- Face attendance

Backend areas:

- `attendanceController.ts`
- `attendanceRouter.ts`
- `attendanceServices.ts`
- `attendance.repo.ts`
- `faceBiometricController.ts`
- `faceBiometricService.ts`

Frontend areas:

- `src/pages/hrms/Attendance/*`
- `src/pages/employee/Attendance/*`
- `src/features/face-attendance/*`

### 5.4 Leave Management

Responsibilities:

- Leave policies, types, periods, blocks, allocations
- Leave applications and approvals
- Compensatory leave and encashment

Backend areas:

- `leaveManagementController.ts`
- `leaveController.ts`
- `leaveRequestController.ts`
- `leaveManagementServices.ts`
- `leaveServices.ts`
- `leaveRequestServices.ts`

Frontend areas:

- `src/pages/hrms/LeaveManagement/*`
- `src/pages/employee/Leave/*`

### 5.5 Payroll

Responsibilities:

- Salary structures
- Salary components
- Payroll entries
- Salary slips
- Accounting and bank integration
- Payroll settings

Backend areas:

- `payrollController.ts`
- `payrollModuleController.ts`
- `payrollServices.ts`
- `payrollModuleServices.ts`
- `payrollCalculation.ts`

Frontend areas:

- `src/pages/hrms/Payroll/*`
- `src/pages/hrms/Settings/PayrollSettings.jsx`
- `src/pages/employee/Payroll/*`

### 5.6 Recruitment and Hiring

Responsibilities:

- Job openings
- ATS screening
- Candidate pipeline
- Interview scheduling and results
- Employee referrals

Backend areas:

- `hiringController.ts`
- `hiringServices.ts`
- `jobServices.ts`
- `job.repo.ts`

Frontend areas:

- `src/pages/hrms/HiringAndRecruitment/*`

### 5.7 Organization, Department, and Designation

Responsibilities:

- Organization structure
- Departments and designations
- org tree / hierarchy management

Backend areas:

- `organizationController.ts`
- `departmentController.ts`
- `desiganationController.ts`
- `organizationServices.ts`
- `departmentServices.ts`
- `desiganationServices.ts`

Frontend areas:

- `src/pages/hrms/Organization/*`
- `src/pages/hrms/Department/*`
- `src/pages/hrms/Designation/*`

### 5.8 Shifts and Scheduling

Responsibilities:

- Shift types
- Shift assignments
- Shift requests

Backend areas:

- `shiftTypeController.ts`
- `shiftAssignmentController.ts`
- `shiftRequestController.ts`
- `shiftTypeServices.ts`
- `shiftAssignmentServices.ts`
- `shiftRequestServices.ts`

Frontend areas:

- `src/pages/hrms/ShiftManagement/*`

### 5.9 Performance and Training

Responsibilities:

- Appraisals
- Energy points / performance rules
- Training and development tracking

Backend areas:

- `performanceController.ts`
- `trainingController.ts`
- `performanceServices.ts`
- `trainingServices.ts`

Frontend areas:

- `src/pages/hrms/EmployeePerformance/*`
- `src/pages/hrms/Employee/EmployeeTabs/Performance.jsx`
- `src/pages/hrms/Employee/EmployeeTabs/TrainingDevelopment.jsx`

### 5.10 Documents and Uploads

Responsibilities:

- Employee document management
- Upload handling
- External blob or file storage integration

Backend areas:

- `documentController.ts`
- `uploadRouter.ts`
- `documentServices.ts`
- `uploadService.ts`

Frontend areas:

- `src/pages/hrms/Employee/EmployeeTabs/Documents.jsx`
- `src/pages/employee/Documents/*`

### 5.11 Subscription and Platform Billing

Responsibilities:

- Plan definitions
- Subscription management
- Billing-related workflows

Backend areas:

- `subscriptionController.ts`
- `subscriptionServices.ts`
- `subscription.repo.ts`
- `config/subscriptionPlans.ts`

## 6. Data Architecture

### 6.1 Database

The primary persistence layer is PostgreSQL.

The schema includes:

- users
- employee
- employment
- attendance
- face biometric embeddings
- departments
- designations
- shift types
- shift assignments
- leave tables
- payroll tables
- hiring and onboarding tables
- subscription tables

### 6.2 Migrations

The backend uses Drizzle migrations stored in:

- `hrms_orga_backend/drizzle/*`

Migration history is tracked through:

- `hrms_orga_backend/drizzle/meta/_journal.json`

### 6.3 Current Attendance Data Model

Attendance currently stores:

- `series`
- `empId`
- `attendanceDate`
- `status`
- `leaveType`
- `shift`
- `period`
- `lateEntry`
- `earlyExit`
- `markedBy`
- `checkIn`
- `checkOut`
- `isDeleted`
- audit timestamps

For face attendance support, the backend now also tracks:

- `checkInVerificationMethod`
- `checkInFaceImage`

## 7. External Integrations

### 7.1 Face Recognition

The backend uses a separate face recognition service for:

- face registration
- face verification
- face-based attendance marking

### 7.2 Email

Used for:

- authentication notifications
- HR and employee communications
- onboarding and operational emails

### 7.3 Payments

Used for:

- subscriptions
- payroll-related payment flows where applicable

### 7.4 File Storage

Used for:

- documents
- uploads
- attendance and employee assets where applicable

## 8. Security Architecture

### 8.1 Auth

- JWT-based session handling
- Protected frontend routes
- Backend middleware validation

### 8.2 Authorization

- Role-based access checks
- Admin-only APIs for HR operations
- Employee-only APIs for self-service actions

### 8.3 Sensitive Data

- Passwords are hashed
- Face embeddings are stored, not raw model outputs
- Face check-in images are now stored on attendance records for admin review

## 9. Deployment Architecture

The repo suggests separate deployment units:

- Frontend: static SPA hosting
- Backend: Node.js service
- Database: managed PostgreSQL
- Face service: separate Python/OpenCV service

The current config also includes Render/Vercel-oriented artifacts in the repo.

## 10. Recommended Module Boundaries

If this architecture is expanded further, these are the boundaries to preserve:

- UI should not directly query the database or contain business logic.
- Controllers should stay thin.
- Services should own validation and workflows.
- Repositories should only talk to persistence.
- Cross-domain logic should live in orchestration services, not pages or controllers.

## 11. Suggested Next Step

If you want this blueprint to become a full engineering architecture, the next layer to add would be:

- domain diagrams
- API contract table
- database ERD
- route map
- role-permission matrix
- deployment diagram

