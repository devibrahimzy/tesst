# AGENTS.md - Backend API Reference for Frontend Developers

## Quick Start

```bash
cd backend
npm install
npm run dev
```

Server runs on port 5000 

## Authentication

All protected endpoints require JWT token in headers:
```
Authorization: Bearer <your_jwt_token>
```
Base URL: http://localhost:5000/api


JWT tokens expire after 1 day. Store tokens securely in frontend (localStorage)

## Response Format

**Success Response:**
```json
{
  "data": { ... }
}
```

**Error Response:**
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Data Models

### User
```json
{
  "id": "char(36)",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "role": "ADMIN|PRODUCT_OWNER|SCRUM_MASTER|TEAM_MEMBER",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "isActive": "boolean",
  "lastLogin": "datetime|null"
}
```

### Project
```json
{
  "id": "char(36)",
  "name": "string",
  "description": "string|null",
  "start_date": "date|null",
  "end_date": "date|null",
  "status": "PLANNING|ACTIVE|COMPLETED",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "isActive": "boolean",
  "created_by": "char(36)|null"
}
```

### Project Member
```json
{
  "id": "char(36)",
  "project_id": "char(36)",
  "user_id": "char(36)",
  "role": "PRODUCT_OWNER|SCRUM_MASTER|TEAM_MEMBER",
  "joined_at": "timestamp",
  "user": { ...user object }
}
```

### Sprint
```json
{
  "id": "char(36)",
  "project_id": "char(36)",
  "name": "string",
  "start_date": "date|null",
  "end_date": "date|null",
  "status": "PLANNING|ACTIVE|COMPLETED",
  "planned_velocity": "integer",
  "actual_velocity": "integer",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "isActive": "boolean"
}
```

### Backlog Item
```json
{
  "id": "char(36)",
  "project_id": "char(36)",
  "sprint_id": "char(36)|null",
  "title": "string",
  "description": "string|null",
  "type": "USER_STORY|BUG|TASK|SPIKE",
  "story_points": "integer",
  "priority": "integer",
  "status": "BACKLOG|TODO|IN_PROGRESS|DONE",
  "position": "integer",
  "assigned_to_id": "char(36)|null",
  "created_by_id": "char(36)|null",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "isActive": "boolean",
  "started_at": "timestamp|null",
  "completed_at": "timestamp|null"
}
```

### Comment
```json
{
  "id": "char(36)",
  "backlog_item_id": "char(36)",
  "user_id": "char(36)",
  "content": "string",
  "created_at": "timestamp",
  "isActive": "boolean",
  "user": { ...user object }
}
```

### Retrospective
```json
{
  "id": "char(36)",
  "sprint_id": "char(36)|null",
  "date": "date|null",
  "status": "DRAFT|PUBLISHED",
  "facilitator_id": "char(36)|null",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "items": [ ...retro items ]
}
```

### Retro Item
```json
{
  "id": "char(36)",
  "retrospective_id": "char(36)|null",
  "category": "POSITIVE|IMPROVE|ACTION",
  "text": "string|null",
  "votes": "integer",
  "author_id": "char(36)|null",
  "created_at": "timestamp",
  "is_completed": "boolean"
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|--------------|----------|
| POST | `/api/auth/register` | No | `{email, password, first_name, last_name, role}` | `{message: "User created"}` |
| POST | `/api/auth/login` | No | `{email, password}` | `{token, user: {id, email, role}}` |
| GET | `/api/auth/profile` | Yes | - | `{message: "Access granted", user: {...User}}` |
| POST | `/api/auth/logout` | Yes | - | `{message: "Logged out successfully"}` |
| POST | `/api/auth/forgot-password` | No | `{email}` | `{message: "Reset token generated", token}` |
| POST | `/api/auth/reset-password` | No | `{token, newPassword}` | `{message: "Password reset successfully"}` |

**User Roles:** `ADMIN`, `SCRUM_MASTER`, `TEAM_MEMBER`

**Login Response Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "146fae23-ddf1-4a3f-a39f-d8f525602964",
    "email": "bono@ourscrum.com",
    "role": "TEAM_MEMBER"
  }
}
```

**Get Profile Response:**
```json
{
  "message": "Access granted",
  "user": {
    "id": "146fae23-ddf1-4a3f-a39f-d8f525602964",
    "email": "bono@ourscrum.com",
    "first_name": "yassine",
    "last_name": "bono",
    "role": "TEAM_MEMBER",
    "created_at": "2026-01-15T02:49:44.000Z",
    "updated_at": "2026-01-15T16:01:16.000Z",
    "isActive": 1,
    "lastLogin": null
  }
}
```

---

### Projects

| Method | Endpoint | Auth | Request Body | Query/Params | Description |
|--------|----------|------|--------------|--------------|-------------|
| GET | `/api/projects/my-projects` | Yes | - | - | Get user's projects |
| GET | `/api/projects/` | Yes | - | - | Get all projects |
| POST | `/api/projects/` | Yes | `{name, description?, start_date?, end_date?}` | - | Create project (user becomes Scrum Master) |
| GET | `/api/projects/:id` | Yes | - | `id` | Get project by ID |
| PUT | `/api/projects/:id` | Yes | `{name?, description?, start_date?, end_date?, status?, isActive?}` | `id` | Update project (Scrum Master only) |
| DELETE | `/api/projects/:id` | Yes | - | `id` | Soft delete project (Scrum Master only) |
| GET | `/api/projects/:id/members` | Yes | - | `id` | Get project members |
| POST | `/api/projects/members` | Yes | `{project_id, user_id, role?}` | - | Add member (Scrum Master only) |
| DELETE | `/api/projects/:id/members/:userId` | Yes | - | `id, userId` | Remove member (Scrum Master only) |

**Project Status:** `PLANNING`, `ACTIVE`, `COMPLETED`
**Member Roles:** `SCRUM_MASTER`, `TEAM_MEMBER`

**Get Projects Response:**
```json
[
  {
    "id": "ea4b036b-875e-4c29-b6f3-3101aba560c4",
    "name": "CAF",
    "description": "finale match",
    "start_date": "2026-02-10",
    "end_date": "2026-04-30",
    "status": "PLANNING",
    "created_at": "2026-01-15T02:51:12.000Z",
    "updated_at": "2026-01-15T02:51:12.000Z",
    "isActive": 1,
    "created_by": "146fae23-ddf1-4a3f-a39f-d8f525602964"
  }
]
```

**Get Project Members Response:**
```json
[
  {
    "id": "79c1ef24-41f3-4a3a-83cb-21832d7284bd",
    "project_id": "ea4b036b-875e-4c29-b6f3-3101aba560c4",
    "user_id": "146fae23-ddf1-4a3f-a39f-d8f525602964",
    "role": "SCRUM_MASTER",
    "joined_at": "2026-01-15T02:51:12.000Z",
    "user": {
      "id": "146fae23-ddf1-4a3f-a39f-d8f525602964",
      "email": "bono@ourscrum.com",
      "first_name": "yassine",
      "last_name": "bono",
      "role": "TEAM_MEMBER"
    }
  }
]
```

---

### Sprints

| Method | Endpoint | Auth | Request Body | Query/Params | Description |
|--------|----------|------|--------------|--------------|-------------|
| GET | `/api/sprints/` | Yes | - | `projectId` | Get sprints by project |
| POST | `/api/sprints/` | Yes | `{project_id, name, start_date?, end_date?, planned_velocity?}` | - | Create sprint (Scrum Master only) |
| PUT | `/api/sprints/:id` | Yes | `{...}` | `id` | Update sprint |
| PUT | `/api/sprints/:id/activate` | Yes | - | `id` | Activate sprint (Scrum Master only) |
| PUT | `/api/sprints/:id/complete` | Yes | - | `id` | Complete sprint (all items must be DONE) |
| DELETE | `/api/sprints/:id` | Yes | - | `id` | Soft delete sprint (Scrum Master only) |

**Sprint Status:** `PLANNING`, `ACTIVE`, `COMPLETED`

**Get Sprints Response:**
```json
[
  {
    "id": "71aee8a6-61d1-46bf-b08a-bd88dfae1684",
    "project_id": "ea4b036b-875e-4c29-b6f3-3101aba560c4",
    "name": "Sprint 3",
    "start_date": "2026-02-01",
    "end_date": "2030-02-14",
    "status": "ACTIVE",
    "planned_velocity": 46,
    "actual_velocity": 10,
    "created_at": "2026-01-15T15:33:50.000Z",
    "updated_at": "2026-01-15T23:53:57.000Z",
    "isActive": 0
  }
]
```

---

### Backlog Items

| Method | Endpoint | Auth | Request Body | Query/Params | Description |
|--------|----------|------|--------------|--------------|-------------|
| GET | `/api/backlog/` | Yes | - | `projectId` | Get backlog by project |
| GET | `/api/backlog/:id` | Yes | - | `id` | Get item by ID |
| GET | `/api/backlog/sprint/:sprintId` | Yes | - | `sprintId` | Get items by sprint |
| POST | `/api/backlog/` | Yes | `{project_id, sprint_id?, title, description?, type?, story_points?, priority?, assigned_to_id?}` | - | Create backlog item |
| PUT | `/api/backlog/:id` | Yes | `{...}` | `id` | Update backlog item |
| PATCH | `/api/backlog/:id/assign` | Yes | `{userId?}` | `id` | Assign/unassign member |
| DELETE | `/api/backlog/:id` | Yes | - | `id` | Soft delete backlog item |

**Backlog Item Fields:**
- `type`: `USER_STORY`, `BUG`, `TASK`, `SPIKE`
- `story_points`: number (0-13 typical)
- `priority`: number (higher = more important)
- `status`: `BACKLOG`, `TODO`, `IN_PROGRESS`, `DONE`
- `position`: number (order in column)

**Get Backlog Items Response:**
```json
[
  {
    "id": "0350de16-e275-41a9-b1b0-c2e7b782ea09",
    "project_id": "ea4b036b-875e-4c29-b6f3-3101aba560c4",
    "sprint_id": "c555881b-ba86-4b77-9086-61ee6991982f",
    "title": "En tant que user je peux creer un sprint",
    "description": "Formulaire de sprint",
    "type": "USER_STORY",
    "story_points": 5,
    "priority": 3,
    "status": "TODO",
    "position": 0,
    "assigned_to_id": null,
    "created_by_id": "55e350e5-9252-46d9-87c6-56fd183408ad",
    "created_at": "2026-01-15T21:02:46.000Z",
    "updated_at": "2026-01-15T21:07:44.000Z",
    "isActive": 1,
    "started_at": null,
    "completed_at": null
  }
]
```

---

### Kanban Board

| Method | Endpoint | Auth | Request Body | Query/Params | Description |
|--------|----------|------|--------------|--------------|-------------|
| GET | `/api/kanban/:sprintId` | Yes | - | `sprintId, assigned_to_id?, type?` | Get Kanban board for sprint |
| PATCH | `/api/kanban/move/:id` | Yes | `{toStatus?, toPosition?, toSprintId?}` | `id` | Move item to new status/position |

**Kanban Columns (Statuses):** `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`

---

### Comments

| Method | Endpoint | Auth | Request Body | Query/Params | Description |
|--------|----------|------|--------------|--------------|-------------|
| GET | `/api/comments/:itemId` | Yes | - | `itemId` | Get comments for backlog item |
| POST | `/api/comments/` | Yes | `{backlog_item_id, content}` | - | Add comment |
| DELETE | `/api/comments/:id` | Yes | - | `id` | Delete comment |

---

### Retrospectives

| Method | Endpoint | Auth | Request Body | Query/Params | Description |
|--------|----------|------|--------------|--------------|-------------|
| GET | `/api/retrospectives/sprint/:sprintId` | Yes | - | `sprintId` | Get retrospective by sprint |
| GET | `/api/retrospectives/project/:projectId` | Yes | - | `projectId` | Get all retrospectives by project |
| GET | `/api/retrospectives/project/:projectId/trends` | Yes | - | `projectId` | Get retrospective trends |
| POST | `/api/retrospectives/` | Yes | `{sprint_id, date, facilitator_id?}` | - | Create retrospective |
| PATCH | `/api/retrospectives/:id/publish` | Yes | - | `id` | Publish retrospective |
| POST | `/api/retrospectives/items` | Yes | `{retrospective_id, category, text}` | - | Add retrospective item |
| POST | `/api/retrospectives/items/:id/vote` | Yes | - | `id` | Vote on retrospective item |
| PATCH | `/api/retrospectives/items/:id/status` | Yes | `{is_completed}` | `id` | Update item action status |
| DELETE | `/api/retrospectives/items/:id` | Yes | - | `id` | Delete retrospective item |

**Retrospective Categories:** `START`, `STOP`, `CONTINUE`, `ACTION`
**Retrospective Status:** `DRAFT`, `PUBLISHED`

---

### Dashboard

| Method | Endpoint | Auth | Query/Params | Description |
|--------|----------|------|--------------|-------------|
| GET | `/api/dashboard/:projectId/summary` | Yes | `projectId` | Get project dashboard summary |
| GET | `/api/dashboard/:projectId/velocity` | Yes | `projectId` | Get velocity data for project |
| GET | `/api/dashboard/:projectId/agile` | Yes | `projectId` | Get agile performance metrics |

**Dashboard Summary Returns:**
```json
{
  "summary": { totalSprints, activeSprint, totalItems, completedItems, teamSize },
  "workload": [{userId, name, assignedCount, completedCount}],
  "velocity": [{sprintId, sprintName, plannedVelocity, actualVelocity}],
  "agile": { avgLeadTime, avgCycleTime, completionRate },
  "sprints": [{id, name, status, startDate, endDate}]
}
```

---

### Users (Admin Only)

| Method | Endpoint | Auth | Admin | Query/Params | Description |
|--------|----------|------|-------|--------------|-------------|
| GET | `/users/` | Yes | Yes | - | Get all users |
| GET | `/users/:id` | Yes | Yes | `id` | Get user by ID |
| PUT | `/users/:id` | Yes | Yes | `id` | Update user |
| DELETE | `/users/:id` | Yes | Yes | `id` | Delete user |

---

## Common Error Codes

| Status | Message | Description |
|--------|---------|-------------|
| 400 | Bad Request | Missing required fields, invalid data |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions (not Scrum Master/Admin) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server error, check response for details |

## Project ID Flow

1. **Create Project** → Returns project ID
2. **Add Members** to project (optional, users can see their own projects)
3. **Create Sprints** with project_id
4. **Create Backlog Items** with project_id (and optionally sprint_id)
5. **Assign Items** to members using PATCH `/api/backlog/:id/assign`
6. **View Kanban** by sprint_id
7. **Complete Sprint** when all items are DONE
8. **Create Retrospective** for completed sprint
