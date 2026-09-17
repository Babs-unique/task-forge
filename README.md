# Task Forge API

Task Forge is a NestJS backend for managing users, projects, and tasks. It uses Prisma with PostgreSQL, JWT-based authentication, and Swagger for API documentation.

## Features

- User registration and login
- JWT-protected authenticated routes
- Project management
- Task management with status and priority fields
- API response transformation
- Validation and Swagger docs
- Prisma migrations for database setup

## Tech stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Swagger
- Jest for unit tests

## Project structure

```bash
src/
  app.module.ts
  main.ts
  auth/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
    constants.ts
    dtos/
    guards/
  project/
    project.controller.ts
    project.module.ts
    project.service.ts
    dto/
  task/
    task.controller.ts
    task.module.ts
    task.service.ts
    dtos/
  prisma/
    prisma.service.ts
  utils/
    transform/
prisma/
  schema.prisma
  migrations/
  generated/
    prisma/
```

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL running locally or via Docker

## Setup

1. Install dependencies

```bash
npm install
```

2. Start PostgreSQL with Docker Compose

```bash
docker compose up -d
```

3. Create a `.env` file in the project root with your database URL and JWT secret:

```env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5433/taskforge?schema=public
JWT_SECRET=your-secret-key
```

4. Generate Prisma client and apply migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

## Run the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production build
npm run build
npm run start:prod
```

The API runs on:

- http://localhost:3000
- Swagger docs: http://localhost:3000/api

## Authentication

The app uses JWT authentication. Protected endpoints expect a bearer token in the Authorization header:

```http
Authorization: Bearer <token>
```

### Auth routes

- `POST /auth/register`
- `POST /auth/logIn`
- `GET /auth/me` (protected)
- `POST /auth/updateUser` (protected)
- `POST /auth/deleteUser` (protected)

## Project endpoints

- `POST /project`
- `GET /project`
- `GET /project/:id`
- `PATCH /project/:id`
- `DELETE /project/:id`

## Task endpoints

- `POST /task/:projectId`
- `GET /task/:projectId`
- `GET /task/:projectId/:taskId`
- `PATCH /task/:projectId/:taskId`
- `DELETE /task/:projectId/:taskId`

## Testing

```bash
npm test
```

For coverage:

```bash
npm run test:cov
```

## Database schema

The app uses these core models:

- `User`
- `Project`
- `Task`

The `Task` model includes:

- `title`
- `description`
- `status` (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
- `priority` (`LOW`, `MEDIUM`, `HIGH`)
- relationships to `Project`

## Notes

- Prisma client output is generated under `generated/prisma`.
- Global validation and response transformation are enabled in `src/main.ts`.
- Swagger is configured in the bootstrap function and exposed at `/api`.

## License

This project is currently unlicensed unless you add a license file later.
