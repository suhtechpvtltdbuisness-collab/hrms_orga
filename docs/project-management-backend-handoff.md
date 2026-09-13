# Project Management Backend Handoff

Use [`project-management-api-fixtures.json`](./project-management-api-fixtures.json) as seed data and response-shape examples. Every record has an `organizationId`; derive this server-side from the authenticated user and never accept it from the client.

## Frontend switch

The project screens run in demo mode by default, so they do not call unavailable endpoints. In demo mode every call is served by `src/features/projects/demoStore.js`, a localStorage-backed implementation of the same operations (projects, members, tasks, activity, progress roll-up and validation), so the UI is fully usable end to end and changes survive a reload — but only in that one browser.

Once the routes below are deployed, set `VITE_PROJECTS_API_ENABLED=true` in the frontend environment and redeploy/restart Vite. The service then calls the live API and only falls back to the demo store if the API is unreachable (network/5xx); 4xx responses surface to the user as real errors.

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
| GET | `/projects/tasks?search=&projectId=&status=&priority=&assigneeId=` | Admin/manager task board across every project |
| GET/POST | `/projects/:projectId/tasks/:taskId/comments` | Task comment thread (`POST` body: `{ "message": "…" }`) |
| GET | `/projects/mine` | Projects visible to the logged-in employee |
| GET | `/projects/tasks/mine` | Tasks assigned to the logged-in employee |

Responses may be either an array or `{ "data": { "items": [] } }`; the UI supports both while the preferred paginated form is `{ "data": { "items": [], "pagination": { "page": 1, "limit": 20, "total": 2 } } }`.

## Required authorization rules

- Admin and permitted managers can manage projects in their own organization.
- Employees can only retrieve projects where they are a member and tasks assigned to themselves.
- Employees may update only their own task's `status` and `progress`; validate allowed status transitions server-side. The employee task page already sends nothing else, but the rule must be enforced by the API.
- Setting a task's `progress` to 100 completes it and completing a task sets `progress` to 100; project progress is the average of its live tasks' progress.
- Task comments are visible to project members; the author is taken from the session, never the request body.
- Archive rather than hard-delete projects/tasks; exclude archived records by default.
- Reject duplicate `(projectId, userId)` memberships and cross-organization IDs.

## Messaging endpoints

The Messages screens (admin `/hrms/messages`, employee `/employee/messages`) follow the same pattern: `src/features/messages/messageService.js` calls the API first and falls back to `messageStore.js`, a localStorage-backed implementation, whenever the API is disabled (`VITE_MESSAGES_API_ENABLED=false`) or unreachable.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/messages/conversations?search=` | Conversations the signed-in user belongs to, newest activity first, with `unreadCount` |
| POST | `/messages/conversations` | Start a conversation (`{ type, name, participantIds }`); direct threads must be deduplicated per pair |
| GET | `/messages/conversations/:id` | One conversation with its participants |
| GET/POST | `/messages/conversations/:id/messages` | Thread history / send (`{ "body": "…" }`) |
| PATCH/DELETE | `/messages/conversations/:id/messages/:messageId` | Edit or delete — author only |
| POST | `/messages/conversations/:id/read` | Mark every message in the thread as read for this user |
| POST | `/messages/conversations/:id/participants` | Add people to a group (`{ userIds: [] }`) |
| DELETE | `/messages/conversations/:id/participants/me` | Leave a group / archive a direct thread |
| GET | `/messages/unread` | Total unread count for badges |

Rules the API must enforce: membership is checked on every read and write; the sender is taken from the session, never the body; only the author may edit or delete a message; group conversations require a name; message bodies are trimmed, non-empty and capped at 4000 characters. Live delivery is local-only today — `messageService.subscribe()` should be swapped for a socket or SSE subscription when the API lands.
