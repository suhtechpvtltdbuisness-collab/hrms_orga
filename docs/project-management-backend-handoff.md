# Project Management Backend Handoff

Use [`project-management-api-fixtures.json`](./project-management-api-fixtures.json) as seed data and response-shape examples. Every record has an `organizationId`; derive this server-side from the authenticated user and never accept it from the client.

## Frontend switch

The project screens run in demo mode by default, so they do not call unavailable endpoints. Once the routes below are deployed, set `VITE_PROJECTS_API_ENABLED=true` in the frontend environment and redeploy/restart Vite.

## Endpoints consumed by the frontend

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/projects?search=&status=&priority=` | Authorized admin/manager listing |
| POST | `/projects` | Create a project and initial members |
| GET/PATCH/DELETE | `/projects/:projectId` | Read, update, archive one project |
| GET/POST | `/projects/:projectId/members` | List/add members |
| DELETE | `/projects/:projectId/members/:userId` | Remove a member |
| GET/POST | `/projects/:projectId/tasks` | List/create project tasks |
| PATCH/DELETE | `/projects/:projectId/tasks/:taskId` | Update/archive a task |
| GET | `/projects/:projectId/activity` | Project audit events |
| GET | `/projects/mine` | Projects visible to the logged-in employee |
| GET | `/projects/tasks/mine` | Tasks assigned to the logged-in employee |

Responses may be either an array or `{ "data": { "items": [] } }`; the UI supports both while the preferred paginated form is `{ "data": { "items": [], "pagination": { "page": 1, "limit": 20, "total": 2 } } }`.

## Required authorization rules

- Admin and permitted managers can manage projects in their own organization.
- Employees can only retrieve projects where they are a member and tasks assigned to themselves.
- Employees may update only their own task's `status` and `progress`; validate allowed status transitions server-side.
- Archive rather than hard-delete projects/tasks; exclude archived records by default.
- Reject duplicate `(projectId, userId)` memberships and cross-organization IDs.
