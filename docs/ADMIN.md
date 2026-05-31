# Admin and content management instructions

This project is designed so a non-technical content manager can update the site without touching code.

## For everyday updates

Use the dashboard at `/dashboard` after signing in.

You can manage:

- Projects
- Services
- Site settings
- Contact messages

## Editing projects

Each project should include:

- Title
- Slug
- Client name
- Category
- Featured image URL
- Gallery images
- Summary and case-study text
- Publication status

## Editing services

Each service should include:

- Title
- Slug
- Short description
- Feature list
- Publish flag

## Editing site settings

Use site settings for global copy such as:

- Site name
- Tagline
- Hero heading and subheading
- About section copy
- Contact email
- Social links

## Publishing guidance

- Save drafts first if you are still reviewing copy
- Set `isPublished` to `true` when content is ready to display publicly
- Use the revalidation endpoint or dashboard save actions to refresh cached pages

## Contact messages

Contact messages appear in the database and can be reviewed from the admin interface or a future management screen.

## If something goes wrong

1. Check whether your account still has the `ADMIN` or `EDITOR` role.
2. Confirm the required env variables are present.
3. Verify the Prisma schema has been applied to the database.
