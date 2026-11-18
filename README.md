# Amanu Properties

Amanu Properties is a full-stack real estate property discovery and sales enquiry platform designed for the Addis Ababa, Ethiopia market.

The platform enables visitors to explore property listings, review property details, submit enquiries, and request property viewings. Administrators can manage property listings, images, visitor enquiries, and viewing requests through a protected administration dashboard.

## Live Project

- **Live Website:** https://amanu-properties.vercel.app/
- **GitHub Repository:** https://github.com/belaaa27/amanu-properties
- **Deployment:** Vercel

## Features

### Public Website

- Responsive homepage with featured property listings.
- Property browsing and listing pages.
- Property detail pages and image galleries.
- Property categories and location information.
- Property pricing with multiple pricing modes.
- About and Contact pages.
- General and property-specific enquiries.
- Property viewing requests.

### Administration Dashboard

- Protected administrator authentication.
- Property creation, editing, and publishing.
- Property availability management.
- Featured property management.
- Property image management through Cloudinary.
- Visitor enquiry management.
- Viewing request management.
- Enquiry status updates and internal administrative notes.
- Search, filtering, and pagination.
- Dashboard statistics and recent enquiry overview.
- Administrative settings and password management.

### Property Pricing

The application supports three pricing modes:

- `TOTAL_ONLY` — displays the total asking price.
- `PER_SQM_ONLY` — displays the price per square metre.
- `EXPLICIT_BOTH` — displays both values when both have been explicitly provided and approved.

Prices use Prisma Decimal fields to avoid relying on JavaScript floating-point arithmetic for monetary values.

## Technology Stack

| Area             | Technology                                           |
| ---------------- | ---------------------------------------------------- |
| Framework        | Next.js 16                                           |
| UI               | React 19                                             |
| Language         | TypeScript                                           |
| Styling          | Tailwind CSS 4                                       |
| Database access  | Prisma ORM 7                                         |
| Database         | TiDB Cloud (production), MariaDB (local development) |
| Database adapter | Prisma MariaDB adapter                               |
| Authentication   | Better Auth                                          |
| Image management | Cloudinary                                           |
| Icons            | Lucide React                                         |
| Deployment       | Vercel                                               |

## Requirements

Install the following before setting up the project:

- Node.js compatible with the installed Next.js version.
- npm.
- A MySQL-compatible database.
- A Cloudinary account for property image management.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/belaaa27/amanu-properties.git
cd amanu-properties
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file in the project root using `.env.example` as a reference.

Configure the required database, authentication, and Cloudinary environment variables.

Never commit `.env` files or expose production credentials.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply database migrations

For a new development database:

```bash
npx prisma migrate dev
```

The Prisma schema is located at `prisma/schema.prisma`, and migration files are stored in `prisma/migrations`.

Do not run development migration resets against databases containing data that must be preserved.

### 6. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Commands

| Command               | Purpose                      |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start the development server |
| `npm run lint`        | Run ESLint                   |
| `npx tsc --noEmit`    | Check TypeScript types       |
| `npx prisma validate` | Validate the Prisma schema   |
| `npx prisma generate` | Generate Prisma Client       |
| `npm run build`       | Create the production build  |
| `npm run start`       | Start the production server  |

## Database and Deployment

The application uses Prisma ORM with a MariaDB-compatible database adapter.

- Local development uses MariaDB.
- Production uses TiDB Cloud.
- Keep local and production database configurations separate.
- Configure the required environment variables in the deployment environment.
- Apply committed production migrations using `npx prisma migrate deploy` when required.
- Verify database connectivity and application functionality after deployment.

Never use development database reset commands against production data.

## Image Management

Property images are managed through Cloudinary.

Administrators can upload and manage listing images through the administration dashboard.

Cloudinary credentials must remain in server-side environment variables. Never expose the Cloudinary API secret in client-side code or public repositories.

## Business Scope

Amanu Properties focuses on real estate discovery, property sales enquiries, and viewing requests.

The application does not currently provide rental management, tenant management, online property checkout, or multi-vendor marketplace functionality.

Only publish property information that has been verified and approved for public display. Keep private property addresses and confidential enquiry information out of public listings.

Any fictional property information used for demonstrations must be clearly identified as demo content until verified business information is available.

## Security

- Keep `.env` files out of version control.
- Use strong administrator credentials.
- Restrict administrative functionality to authorized administrators.
- Keep Cloudinary API secrets server-side.
- Protect visitor enquiries and administrative information.
- Never commit database backups, credentials, or local development data.

## Quality Checks

Run the following checks before committing or deploying changes:

```bash
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run lint
npm run build
```

Resolve errors before release and review warnings where appropriate.

## Project Status

**Status: Completed and deployed.**

The public website, administrator dashboard, property management, visitor enquiries, viewing requests, authentication, and production deployment have been implemented.

The project is available at:

https://amanu-properties.vercel.app/
