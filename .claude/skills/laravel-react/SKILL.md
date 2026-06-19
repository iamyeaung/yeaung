---
name: laravel-react
description: Best practices for writing clean Laravel API and React/Next.js code in the DevPulse project. Use when adding backend API endpoints, frontend components, or full-stack features.
---

# Laravel + React/Next.js Best Practices for DevPulse

You are building **DevPulse**, a developer tooling/monitoring dashboard. The backend is a **Laravel API** and the frontend is **React (Next.js)**. Follow these practices when writing any code.

---

## 1. Project Structure

### Laravel Backend (`/backend` or `/api`)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    # API controllers only — no web routes
│   │   ├── Middleware/
│   │   ├── Requests/            # Form requests for validation
│   │   └── Resources/           # API resources for response transformation
│   ├── Models/
│   ├── Services/                # Business logic — keep controllers thin
│   ├── Enums/                   # PHP 8.1+ enums for statuses, roles, types
│   ├── Actions/                 # Single-action classes for complex operations
│   └── Events/
├── routes/
│   └── api.php                  # All routes here — never web.php for API
├── tests/
│   ├── Feature/                 # HTTP tests hitting endpoints
│   └── Unit/                    # Pure unit tests for services/actions
└── database/
    └── migrations/
```

### React/Next.js Frontend (`/frontend` or `/web`)

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router pages
│   ├── components/
│   │   ├── ui/                  # Primitive UI (buttons, inputs, modals)
│   │   ├── layout/              # Shell, sidebar, header, page wrappers
│   │   └── features/            # Domain components (dashboard cards, charts)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities, API client, constants
│   ├── types/                   # TypeScript type definitions
│   └── stores/                  # Zustand or context state
├── public/
└── tests/
```

---

## 2. Laravel API Best Practices

### Controllers — Keep Them Thin

Controllers handle HTTP concerns only: receive a request, delegate to a service/action, return a response. Never put business logic in a controller.

```php
// ✅ Good: Thin controller
class PulseController extends Controller
{
    public function __construct(
        private readonly PulseService $pulse,
    ) {}

    public function index(PulseIndexRequest $request): PulseCollection
    {
        return new PulseCollection(
            $this->pulse->listForUser($request->user(), $request->filters())
        );
    }
}
```

```php
// ❌ Bad: Fat controller with business logic
class PulseController extends Controller
{
    public function index(Request $request)
    {
        $query = Pulse::where('user_id', auth()->id());
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        // ... 20 more lines of query building
        return PulseResource::collection($query->paginate());
    }
}
```

### Form Requests for Validation

Always extract validation into dedicated form request classes. Controllers should receive validated, typed data.

```php
// ✅ Good
class StorePulseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'type'        => ['required', new Enum(PulseType::class)],
            'project_id'  => ['required', 'exists:projects,id'],
            'config'      => ['nullable', 'array'],
            'config.*.key' => ['required', 'string'],
        ];
    }

    public function filters(): PulseFilters
    {
        return new PulseFilters(
            type: PulseType::tryFrom($this->validated('type')),
            projectId: $this->validated('project_id'),
        );
    }
}
```

### API Resources for Responses

Use API Resources to transform models into consistent JSON. Never return raw models from controllers.

```php
// ✅ Good
class PulseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'type'       => $this->type->value,
            'status'     => $this->status->value,
            'project'    => new ProjectResource($this->whenLoaded('project')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
```

### Services for Business Logic

Services contain the core domain logic. Inject them via the constructor. They should be stateless (or scoped to the request lifecycle via the container).

```php
class PulseService
{
    public function listForUser(User $user, PulseFilters $filters): Collection
    {
        return Pulse::query()
            ->forUser($user)
            ->filter($filters)
            ->with('project')
            ->latest()
            ->get();
    }

    public function create(User $user, CreatePulseDTO $dto): Pulse
    {
        return DB::transaction(function () use ($user, $dto) {
            $pulse = $user->pulses()->create($dto->toArray());
            event(new PulseCreated($pulse));
            return $pulse->load('project');
        });
    }
}
```

### Route Conventions

- Use **nested resources** for ownership: `users/{user}/pulses` not `pulses?user_id=1`.
- Name routes explicitly: `Route::get('pulses/{pulse}', ...)->name('pulses.show')`.
- Group by middleware, not by prefix alone.
- Use `Route::apiResource()` for CRUD endpoints.

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('projects.pulses', ProjectPulseController::class)->shallow();
    Route::get('dashboard', [DashboardController::class, 'index']);
});
```

---

## 3. React/Next.js Frontend Best Practices

### App Router Conventions

Use Next.js App Router with **Server Components by default**. Only add `'use client'` when you need interactivity (state, effects, browser APIs).

```
src/app/
├── (auth)/               # Route group — no URL segment
│   ├── login/page.tsx
│   └── layout.tsx        # Auth-specific layout (no sidebar)
├── (dashboard)/           # Route group for authenticated pages
│   ├── layout.tsx         # Sidebar + header shell
│   ├── page.tsx           # Dashboard home
│   ├── projects/
│   │   ├── page.tsx       # Project list
│   │   └── [id]/
│   │       ├── page.tsx   # Project detail
│   │       └── pulses/
│   │           └── page.tsx
│   └── settings/page.tsx
├── layout.tsx             # Root layout (providers, fonts)
├── error.tsx              # Error boundary
├── loading.tsx            # Top-level loading state
└── not-found.tsx
```

### Server Components vs Client Components

```tsx
// ✅ Server Component (default) — fetches data, no interactivity
// src/app/(dashboard)/projects/page.tsx
import { ProjectList } from '@/components/features/project-list';
import { api } from '@/lib/api';

export default async function ProjectsPage() {
  const projects = await api.projects.list();

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Manage your projects" />
      <ProjectList projects={projects} />
    </div>
  );
}
```

```tsx
// ✅ Client Component — only when interactivity is needed
'use client';

import { useState } from 'react';
import { createProject } from '@/lib/actions';

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Project</Button>
      </DialogTrigger>
      <DialogContent>
        <form action={createProject}>
          <Input name="name" value={name} onChange={e => setName(e.target.value)} />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Data Fetching Pattern

Centralize API calls in `lib/api.ts`. Use **Server Actions** for mutations and direct `fetch` (or a typed client) for server-side reads.

```tsx
// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, error.message);
  }

  return res.json();
}

export const api = {
  projects: {
    list: ()     => fetchApi<Project[]>('/projects'),
    get: (id: string)  => fetchApi<Project>(`/projects/${id}`),
    create: (data: CreateProject) => fetchApi<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: UpdateProject) => fetchApi<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/projects/${id}`, { method: 'DELETE' }),
  },
  pulses: {
    list: (projectId: string) => fetchApi<Pulse[]>(`/projects/${projectId}/pulses`),
    get: (id: string) => fetchApi<Pulse>(`/pulses/${id}`),
  },
};
```

### Component Patterns

**Composition over configuration.** Build small, focused components and compose them. Avoid giant components with many props controlling behavior.

```tsx
// ✅ Good — composed
<Card>
  <Card.Header>
    <Card.Title>CPU Usage</Card.Title>
    <Card.Description>Last 24 hours</Card.Description>
  </Card.Header>
  <Card.Content>
    <AreaChart data={cpuData} />
  </Card.Content>
</Card>

// ❌ Bad — monolithic
<ChartCard title="CPU Usage" description="Last 24 hours" type="area" data={cpuData}
  showLegend legendPosition="bottom" height={300} colors={['blue']} showGrid />
```

### TypeScript Types

Derive types from the API response shape. Keep types close to where they're used.

```tsx
// src/types/pulse.ts
export type PulseType = 'uptime' | 'latency' | 'error_rate' | 'throughput';

export type PulseStatus = 'active' | 'paused' | 'degraded' | 'failing';

export interface Pulse {
  id: string;
  name: string;
  type: PulseType;
  status: PulseStatus;
  project: Project | null;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

### Styling

Use **Tailwind CSS** with consistent spacing and color tokens. Follow mobile-first responsive design.

```tsx
// ✅ Good — semantic Tailwind classes, mobile-first
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {pulses.map(pulse => (
    <PulseCard key={pulse.id} pulse={pulse} />
  ))}
</div>

// Use cn() helper for conditional classes
import { cn } from '@/lib/utils';

function PulseCard({ pulse, className }: PulseCardProps) {
  return (
    <div className={cn(
      'rounded-lg border p-4',
      pulse.status === 'failing' && 'border-red-500 bg-red-50',
      className,
    )}>
      ...
    </div>
  );
}
```

### Error & Loading States

Every async component must handle loading, error, and empty states.

```tsx
// ✅ Server component with Suspense boundary
export default function PulsesPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pulses</h1>
      <Suspense fallback={<PulseListSkeleton />}>
        <PulseListContent projectId={params.id} />
      </Suspense>
    </div>
  );
}

async function PulseListContent({ projectId }: { projectId: string }) {
  const pulses = await api.pulses.list(projectId);

  if (pulses.length === 0) {
    return <EmptyState title="No pulses yet" description="Create your first pulse to start monitoring." action={<CreatePulseButton />} />;
  }

  return <PulseList pulses={pulses} />;
}
```

---

## 4. Cross-Cutting Concerns

### Error Handling

- **Laravel**: Use exception handling in `Handler.php`. Return consistent JSON error responses with `{ error: string, message: string, status: number }`.
- **Frontend**: Use React Error Boundaries for component trees. Catch API errors in the API client layer, not in every component.

### Authentication

- **Backend**: Use Laravel Sanctum for SPA authentication. Protect all API routes with `auth:sanctum` middleware.
- **Frontend**: Use middleware in `src/middleware.ts` to redirect unauthenticated users. Store the token in an HTTP-only cookie (handled by Sanctum).

### Validation

- **Backend**: Form request validation before any business logic.
- **Frontend**: Use Zod or React Hook Form with client-side validation that mirrors server rules.

### Testing

```php
// Backend: Feature test — test the API contract, not implementation
class PulseApiTest extends TestCase
{
    /** @test */
    public function it_lists_pulses_for_authenticated_user(): void
    {
        $user = User::factory()->create();
        Pulse::factory()->for($user)->count(3)->create();

        $response = $this->actingAs($user)->getJson('/api/pulses');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure(['data' => [['id', 'name', 'type', 'status']]]);
    }
}
```

```tsx
// Frontend: Test components with Testing Library
test('renders empty state when no pulses exist', () => {
  render(<PulseList pulses={[]} />);
  expect(screen.getByText('No pulses yet')).toBeInTheDocument();
});
```

---

## 5. DevPulse-Specific Conventions

### Naming

| Context | Convention | Example |
|---------|-----------|---------|
| Models | PascalCase singular | `Pulse`, `Project`, `Monitor` |
| Tables | snake_case plural | `pulses`, `projects`, `monitors` |
| Controllers | PascalCase singular + `Controller` | `PulseController` |
| API routes | kebab-case plural | `/api/deploy-events` |
| React components | PascalCase, feature-first | `PulseCard`, `CreateProjectDialog` |
| Hooks | `use` prefix | `usePulses`, `useProjectFilter` |
| Database columns | snake_case | `project_id`, `created_at` |
| JSON keys | camelCase | `{ "projectId": 1 }` |

### Commit Messages

```
type(scope): brief description

- feat(pulses): add pulse creation endpoint
- fix(dashboard): handle empty chart data
- refactor(api): extract pagination into trait
- chore(deps): update laravel to 11.x
```

---

## 6. What to Avoid

- **Never** put secrets in frontend code — use environment variables prefixed with `NEXT_PUBLIC_` only for public values.
- **Never** return raw Eloquent models from controllers — always use API Resources.
- **Never** write raw SQL unless the query builder cannot express it — use Eloquent or the query builder.
- **Never** use `useEffect` for data fetching — use Server Components or a data-fetching library (TanStack Query for client-side fetches).
- **Never** skip loading states — every async view needs a fallback.
- **Never** pass entire model objects to the frontend — transform through API Resources to avoid leaking fields like `password` or `remember_token`.

---

## 7. Quick Reference

```bash
# Laravel
php artisan make:model Pulse -mf        # Model + migration + factory
php artisan make:controller Api/PulseController --api
php artisan make:resource PulseResource
php artisan make:request StorePulseRequest
php artisan test --parallel

# Next.js
npx create-next-app@latest frontend --typescript --tailwind --app
npm run dev
npm run build
npm run lint
```
