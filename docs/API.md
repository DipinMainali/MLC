# API documentation

## Standard response shape

Success:

- `{ "success": true, "data": { ... } }`

Error:

- `{ "success": false, "error": { "message": "...", "code": "...", "details": ... } }`

## Backend architecture

- Controllers live in `features/**/**.controller.ts`
- Business logic lives in `features/**/**.service.ts`
- Prisma access lives in `features/**/**.repository.ts`
- Request validation lives in feature-local Zod schemas
- Errors are normalized through the shared `features/system/errors` layer
- Request logging is centralized in `features/system/logging`

## Middleware behavior

- Requests to `/dashboard/*`, `/admin/*`, and `/api/content/*` require an authenticated session
- `/api/contact` and API routes are rate limited by client IP
- NextAuth internal routes are bypassed by middleware to avoid interfering with sign-in callbacks
- Middleware emits structured request logs and attaches rate-limit headers to API responses

## Authentication

### `GET /api/auth/me`

Returns the current Auth.js session.

### `GET /api/auth/token`

Returns a signed bearer token for API clients when the user is logged in.

## Content APIs

### `GET /api/content/projects`

Lists published projects.

### `POST /api/content/projects`

Creates a project. Requires `ADMIN` or `EDITOR` role.

### `GET /api/content/projects/[slug]`

Returns a single project by slug.

### `PATCH /api/content/projects/[slug]`

Updates a project. Requires `ADMIN` or `EDITOR` role.

### `DELETE /api/content/projects/[slug]`

Deletes a project. Requires `ADMIN` or `EDITOR` role.

### `GET /api/content/services`

Lists published services.

### `POST /api/content/services`

Creates a service. Requires `ADMIN` or `EDITOR` role.

### `GET /api/content/services/[slug]`

Returns a single service by slug.

### `PATCH /api/content/services/[slug]`

Updates a service. Requires `ADMIN` or `EDITOR` role.

### `DELETE /api/content/services/[slug]`

Deletes a service. Requires `ADMIN` or `EDITOR` role.

### `GET /api/content/site-settings`

Returns the current site settings singleton.

### `PATCH /api/content/site-settings`

Updates the site settings singleton. Requires `ADMIN` or `EDITOR` role.

## Contact API

### `POST /api/contact`

Stores an inbound contact message.

Required fields:

- `name`
- `email`
- `message`

## Revalidation webhook

### `POST /api/revalidate`

Headers:

- `x-webhook-secret: <WEBHOOK_SECRET>`

Body example:

- `{ "_type": "project" }`
- `{ "tags": ["projects", "services"] }`

## Content validation notes

- Project and service routes use Zod schema validation before writes
- Public read routes return published data only
- Admin writes revalidate the matching cache tags
- Controller functions own auth checks and route-level orchestration
- Repository functions are responsible for database queries only
