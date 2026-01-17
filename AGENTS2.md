# AGENTS2.md - Frontend Development Guidelines

## Build Commands

```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

**Note**: No test framework is currently configured. Add tests before running single test commands.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **State**: Zustand
- **Styling**: Tailwind CSS v4
- **HTTP**: Axios
- **Fonts**: Geist Sans, Geist Mono (Google Fonts)

---

## Project Structure

```
app/              # Next.js App Router pages
components/       # Shared UI components
  ui/            # Basic UI elements (Button, Input, Card)
  layout/        # Layout components (Topbar, Sidebar)
  common/        # Common utilities
features/         # Domain-specific modules
  auth/          # Authentication (store, service, types)
  projects/      # Project management
  sprints/       # Sprint management
  backlog/       # Backlog items
  kanban/        # Kanban board
  dashboard/     # Analytics
  comments/      # Comments
lib/              # Utilities (axios instance, auth helpers, debounce)
types/            # Global type definitions
styles/           # Global CSS (globals.css)
```

---

## Code Style Guidelines

### File Naming

- **Pages/Route files**: `page.tsx` (kebab-case directories)
- **Components**: `PascalCase.tsx`
- **Services**: `kebab-case.service.ts`
- **Stores**: `kebab-case.store.ts`
- **Types**: `kebab-case.types.ts` (or inline in feature files)
- **Utilities**: `kebab-case.ts`

### Imports

- Use `@/*` alias for project imports (configured in tsconfig)
- Order: 1) React/Next.js, 2) External libs, 3) Internal modules, 4) Styles
```typescript
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";
```

### Component Conventions

- **Function components** with explicit props interfaces
```typescript
interface Props {
  sprintId: string;
  onMove?: (itemId: string) => void;
}

export default function Board({ sprintId, onMove }: Props) {
  // Component logic
}
```

- **Default exports** for pages, **named exports** for utilities
```typescript
// pages: default export
export default function ProjectsPage() {}

// services/stores: named export
export const projectService = { ... }
```

### TypeScript

- **No `any`** - use proper types or `unknown` for dynamic data
- **Interfaces** for object shapes, **types** for unions/primitives
- **Explicit return types** for service functions
```typescript
export const projectService = {
  async getProject(id: string): Promise<Project | null> { ... }
};
```

### State Management (Zustand)

- Stores in `features/*/store.ts`
- Named export: `useFeatureStore`
```typescript
import { create } from "zustand";

interface FeatureState {
  items: Item[];
  setItems: (items: Item[]) => void;
}

export const useFeatureStore = create<FeatureState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```

### API Services

- Services in `features/*/service.ts`
- Use axios instance from `@/lib/axios`
- Async methods with proper error handling
```typescript
import api from "@/lib/axios";

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const { data } = await api.get("/projects");
    return data;
  },
};
```

### Error Handling

- Try-catch in async operations
- Display user-friendly errors
```typescript
try {
  await projectService.createProject(data);
} catch (error) {
  console.error("Failed to create project:", error);
  alert("Could not create project. Please try again.");
}
```

### Tailwind CSS

- Utility-first approach
- Use color scale: `primary-500`, `status-todo`, `priority-high`
- Responsive design: `md:`, `lg:` prefixes
```typescript
<div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
</div>
```

---

## Configuration Files

- **TypeScript**: `tsconfig.json` - strict mode enabled, path alias `@/*`
- **ESLint**: `eslint.config.mjs` - Next.js core-web-vitals + TypeScript rules
- **Tailwind**: `tailwind.config.ts` - custom colors for status, priority, type

---

## Common Patterns

### Page Component
```typescript
export default function FeaturePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1>Page Title</h1>
      {/* Page content */}
    </div>
  );
}
```

### Feature Service + Store Pair
- `service.ts`: API calls
- `store.ts`: Local state + actions
- Page/Component uses store, store uses service

---

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001/api)

---

## Running Specific Lint Files

```bash
npx eslint path/to/file.tsx    # Lint specific file
npx eslint features/            # Lint folder
```

---

## Testing (To Be Added)

Project currently has no test framework. Recommend adding:
- **Vitest** for unit tests
- **React Testing Library** for component tests
- **Playwright** for E2E tests

Add to package.json scripts when configured:
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:e2e": "playwright test"
```
