# Amanu Properties

Amanu Properties is a real estate property discovery and sales enquiry platform for properties in Addis Ababa, Ethiopia.

The platform allows visitors to explore published property listings, review property details, and contact the business to make enquiries or request a viewing. An administrator can manage property listings, images, enquiries, and viewing requests through a protected dashboard.

## Features

### Public website

- Homepage with featured property listings
- Property browsing and listing pages
- Property details and image galleries
- Property category and location information
- Property pricing display with supported pricing modes
- About and Contact pages
- General enquiries and property enquiries
- Viewing requests

### Administration

- Protected administrator area
- Property creation and editing
- Property publishing and availability management
- Featured property management
- Property image management through Cloudinary
- Enquiry and viewing-request management
- Administrative settings

### Property pricing

The application supports three pricing modes:

- `TOTAL_ONLY` — display the total asking price.
- `PER_SQM_ONLY` — display the price per square metre.
- `EXPLICIT_BOTH` — display both values when both have been explicitly provided and approved.

Prices are stored using Prisma Decimal fields to avoid relying on JavaScript floating-point arithmetic for monetary values.

## Technology stack

| Area              | Technology                |
| ----------------- | ------------------------- |
| Framework         | Next.js 16                |
| UI                | React 19                  |
| Language          | TypeScript                |
| Styling           | Tailwind CSS 4            |
| Database access   | Prisma ORM 7              |
| Database          | MySQL-compatible database |
| Database adapter  | Prisma MariaDB adapter    |
| Authentication    | Better Auth               |
| Image management  | Cloudinary                |
| Icons             | Lucide React              |
| Deployment target | Vercel                    |

## Requirements

Install the following before setting up the project:

- Node.js (use a version compatible with the installed Next.js release)
- npm
- A running MySQL-compatible database
- A Cloudinary account for property image management

## Getting started

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

Fill in the database connection details and the required authentication and Cloudinary configuration.

Never commit `.env` or share production credentials.

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

Do not use `prisma migrate reset` against a database containing data you need to preserve.

### 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available commands

| Command               | Purpose                      |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start the development server |
| `npm run lint`        | Run ESLint                   |
| `npx tsc --noEmit`    | Check TypeScript types       |
| `npx prisma validate` | Validate the Prisma schema   |
| `npx prisma generate` | Generate Prisma Client       |
| `npm run build`       | Create the production build  |
| `npm run start`       | Start the production server  |

## Database and production builds

The public homepage retrieves property data from the database during static generation.

Therefore:

- The database must be running and reachable when running `npm run build`.
- The production build environment must have valid database connection configuration.
- Production migrations should be applied before relying on the deployed application.
- Use `npx prisma migrate deploy` for applying committed migrations in production, after configuring the production database connection.

Do not run development migration resets against production data.

## Images

Property images are managed through Cloudinary.

Use the administrator interface to add and manage listing images. Keep Cloudinary credentials in environment variables and never expose the API secret in client-side code or public repositories.

## Business scope

Amanu Properties is designed for property discovery, sales enquiries, and viewing requests.

The platform does not provide rental management, tenant management, online property checkout, or multi-vendor marketplace functionality.

Only publish property information that has been verified and approved for public display. Keep private property addresses and other confidential information out of public listing content.

## Security

- Keep `.env` out of version control.
- Use strong administrator credentials.
- Keep Cloudinary API secrets server-side.
- Restrict administrative functionality to authorized administrators.
- Do not publish private addresses or confidential enquiry information.
- Do not commit database backups, credentials, or local development data.

## Quality checks before release

Run the following commands before committing or deploying:

```bash
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run lint
npm run build
```

Resolve errors before release. Review warnings and address them where appropriate.

## Project status

This repository contains the Amanu Properties application. Production configuration, database migrations, administrator access, and deployment settings must be configured for the target environment before launch.
