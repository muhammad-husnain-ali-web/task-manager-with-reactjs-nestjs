# Task Manager Project

## Overview
The Task Manager is a full‑stack application consisting of a **NestJS backend** and a **React + Vite frontend**. The backend provides a RESTful API for managing tasks, users, and authentication, while the frontend offers a modern, responsive UI for interacting with those APIs.

## Repository Structure
```
Task Manager Nest.js/
├─ task-manager-backend/   # NestJS API server
├─ task-manager-frontend/  # React/Vite UI
└─ README.md               # This file (project overview)
```

## Getting Started
### Prerequisites
- Node.js >= 18
- npm >= 9
- Docker (optional, for the PostgreSQL database used by the backend)

### Setup
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "Task Manager Nest.js"
   ```
2. **Backend** – see [`task-manager-backend/README.md`](task-manager-backend/README.md) for detailed setup, installation, and API documentation.
3. **Frontend** – see [`task-manager-frontend/README.md`](task-manager-frontend/README.md) for instructions on running the UI.

## Running the Full Stack Locally
```bash
# In one terminal, start the backend
cd task-manager-backend
npm run start:dev

# In another terminal, start the frontend
cd ../task-manager-frontend
npm run dev
```
The frontend will be available at `http://localhost:5173` and will communicate with the backend at `http://localhost:3000` (adjust the `VITE_API_URL` in the frontend `.env` if needed).

## Docker Compose (Optional)
A `docker-compose.yml` can be added to orchestrate both services and a PostgreSQL database. Refer to the backend README for Docker usage.

## License
Both the backend and frontend are licensed under the MIT License.
