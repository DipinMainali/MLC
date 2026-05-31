# Codebase memory

This file is the living reference for the project. Update it whenever the backend structure, conventions, or data contracts change.

## Current architecture

- Framework: Next.js 15 App Router
- Data: PostgreSQL via Prisma
- Auth: Auth.js / NextAuth with JWT sessions
- OAuth: Google
- Credentials login: email/password sign-in via bcryptjs-backed Credentials provider
- Prisma config now lives in `prisma.config.ts` and seeds via `tsx prisma/seed.ts`
- Validation: Zod schemas in feature modules
- Layering: `controller -> service -> repository`

## Folder conventions

- `app/` — route handlers, pages, layouts
- `features/` — domain logic grouped by feature
- `lib/` — shared infrastructure helpers
- `prisma/` — database schema and future migrations
- `docs/` — operator and developer documentation

## Feature modules

- `features/auth` — token issuing, auth utilities, and login validation
- Prisma seed script provisions an admin user from `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`
- `prisma/seed.ts` — TypeScript admin bootstrap seed script
- `features/content/projects` — project CRUD and DTO mapping
- `features/content/services` — service CRUD and DTO mapping
- `features/content/site-settings` — singleton site settings management
- `features/contact` — contact form persistence
- Feature-local interfaces live beside each feature as `*.interfaces.ts`
- Zod schemas live beside each feature as `*.schemas.ts`

## API standards

- Validate all request bodies with Zod before persistence
- Return structured JSON responses only
- Use `401` for unauthenticated requests
- Use `403` for authenticated users without content-management role
- Use `404` when a resource is not found
- Revalidate tags after content writes
- Controllers should translate request input to typed service calls
- Repositories should be Prisma-only and avoid request-specific concerns
- Middleware now lives under `middleware/` with separate files for config, session lookup, authorization, logging, rate limiting, and response helpers
- Middleware should protect `/dashboard`, `/admin`, `/api/content/*`, and `/api/auth/token`, while leaving static assets and NextAuth internals alone
- Rate limiting is backed by Upstash Redis via `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- API route modules now use `app/api/_lib/route-handlers.ts` to declare method exports declaratively

## Database design notes

- `User` owns auth state and roles
- Role is stored in `User.data.role` for the current JSON-backed auth model
- Admin seed env vars live in `.env` as `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, and `ADMIN_SEED_NAME`
- `Account` connects OAuth providers
- `ProjectCategory` is a parent record for many `Project` rows
- `Project` owns many `ProjectImage` rows
- `Service` owns many `ServiceFeature` rows
- `SiteSetting` is treated as a singleton configuration record
- `ContactMessage` stores inbound inquiries and optional author link

## Role rules

- `ADMIN` — full access
- `EDITOR` — can manage content
- `VIEWER` — authenticated, non-admin access only

## Working notes

- Sanity CMS files were removed from the repository
- Demo utilities were removed to avoid backend ambiguity
- The old `app/page.js` duplicate entrypoint was removed
- Front-end portfolio pages still use static sample project data and can be migrated later to the Prisma-backed APIs
- Prisma-backed project detail routes are forced dynamic so builds do not stall on `app/projects/[slug]/page.tsx`

## Update checklist

When changing backend behavior:

1. Feature service or schema
2. Matching API route handler
3. `docs/API.md`
4. `docs/DATABASE.md` if relationships changed
