# Task Manager Backend

## Description
A NestJS based backend for the Task Manager application. It provides a RESTful API for managing tasks, users, and authentication.

## Prerequisites
- Node.js >= 18
- npm >= 9
- Docker (optional, for running a local PostgreSQL instance)

## Installation
```bash
# Clone the repository (if not already done)
git clone <repo-url>
cd task-manager-backend

# Install dependencies
npm ci
```

## Running the Server
### Development
```bash
npm run start:dev
```
The server will start on `http://localhost:3000` with hot‑reload enabled.

### Production
```bash
npm run build
npm run start:prod
```

## API Overview
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Retrieve all tasks |
| POST | `/tasks` | Create a new task |
| GET | `/tasks/:id` | Retrieve a task by ID |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

*(Add more endpoints as needed)*

## Testing
```bash
# Unit tests
npm run test

# End‑to‑end tests
npm run test:e2e
```

## Docker Setup (Optional)
```bash
docker compose up -d
```
This will start a PostgreSQL container configured for the app.

## Deployment
Refer to the [NestJS Deployment Guide](https://docs.nestjs.com/deployment) for production deployment strategies (Docker, AWS, etc.).

## License
This project is licensed under the MIT License.
