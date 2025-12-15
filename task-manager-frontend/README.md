# Task Manager Frontend

## Description
A modern React application built with Vite for the Task Manager project. It provides a user-friendly interface to interact with the backend API, allowing users to create, view, edit, and delete tasks.

## Prerequisites
- Node.js >= 18
- npm >= 9

## Installation
```bash
# Clone the repository (if not already done)
git clone <repo-url>
cd task-manager-frontend

# Install dependencies
npm ci
```

## Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173` with hot module replacement.

## Build for Production
```bash
npm run build
```
The production-ready files will be generated in the `dist` folder.

## Testing
```bash
# Unit tests (if configured)
npm run test
```

## Deployment
Serve the `dist` folder with any static file server (e.g., `serve`, Nginx, Docker). Ensure the backend API URL is correctly configured in the environment variables.

## Environment Variables
Create a `.env` file at the project root with:
```
VITE_API_URL=http://localhost:3000/api
```
Adjust the URL as needed for your deployment.

## License
This project is licensed under the MIT License.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
