# Database schema overview

## Identity and auth

- `User` — authenticated user profile and role
- `Account` — OAuth provider links for Google and Facebook
- `Session` — compatibility table for Auth.js
- `VerificationToken` — compatibility table for Auth.js

## Content tables

- `ProjectCategory` — parent taxonomy for projects
- `Project` — project case studies
- `ProjectImage` — ordered image gallery items for a project
- `Service` — service listings
- `ServiceFeature` — ordered feature bullets for a service
- `SiteSetting` — singleton site configuration record
- `Experience` — timeline items for the about section
- `Skill` — skill entries for the skills section
- `ProcessStep` — ordered workflow steps
- `ContactMessage` — inbound lead/contact form submissions

## Relationships

- One `User` can own many `ContactMessage` rows
- One `ProjectCategory` can contain many `Project` rows
- One `Project` can contain many `ProjectImage` rows
- One `Service` can contain many `ServiceFeature` rows

## Role model

- `ADMIN` — site owner and full content management access
- `EDITOR` — can create and manage content
- `VIEWER` — authenticated visitor only

## Suggested admin workflow

1. Create a user through Google or Facebook sign-in.
2. Promote the user record to `ADMIN` or `EDITOR` in the database.
3. Use the admin dashboard or the REST APIs to create content.
4. Publish content by setting `isPublished` to `true`.

## Backend data access notes

- Prisma queries are isolated inside feature repository modules
- Feature services own validation and business rules before persistence
- Controllers are the only layer that should know about `NextRequest` and route params