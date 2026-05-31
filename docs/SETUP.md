# Setup and installation

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- pnpm
- PostgreSQL database

## Install

1. Install dependencies.
2. Copy your production or local environment values into `.env`.
3. Make sure `DATABASE_URL` points at your Aiven PostgreSQL instance.
4. Add `AUTH_SECRET` and OAuth credentials for Google and Facebook.

## Database

Generate the Prisma client and apply the schema:

- `pnpm prisma generate`
- `pnpm prisma migrate dev --name init`

If you only want to sync the schema in a non-migration workflow, use `pnpm prisma db push`.

## Run locally

- `pnpm dev`

## Production build

- `pnpm build`
- `pnpm start`

## Required environment variables

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`
- `WEBHOOK_SECRET`