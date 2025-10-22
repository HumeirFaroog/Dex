# Quick Start Guide

## One-Command Setup

Run this single command to install all dependencies:

```bash
npm install
```

> **Note:** This project uses npm workspaces, so `npm install` automatically installs dependencies for both client and server!

## Development

### Run Both Frontend and Backend Together

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend app on `http://localhost:5173`

### Run Separately

**Backend only:**
```bash
npm run dev:server
```

**Frontend only:**
```bash
npm run dev:client
```

## Building for Production

```bash
npm run build
```

This builds the React frontend for production.

## Testing

```bash
npm test
```

Runs tests for both backend and frontend.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for root, server, and client |
| `npm run dev` | Run both server and client in development mode |
| `npm run dev:server` | Run only the backend server |
| `npm run dev:client` | Run only the frontend client |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the production server |
| `npm test` | Run all tests |
| `npm run clean` | Remove all node_modules and build files |
| `npm run clean:install` | Clean and reinstall everything |

## First Time Setup

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   
   Create `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   # MONGODB_URI is optional - leave empty for in-memory storage
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   OPENAI_API_KEY=your-openai-api-key
   CLIENT_URL=http://localhost:5173
   ```
   
   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## Sample Login Credentials

If using in-memory storage (no MongoDB):

- **Patient:** `patient@example.com` / `password123`
- **Doctor:** `doctor@example.com` / `password123`
- **Admin:** `admin@example.com` / `password123`

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use, change them in:
- `server/.env` (PORT)
- `client/vite.config.js` (server.port)

### Dependencies Issues
```bash
npm run clean:install
```

### MongoDB Connection Issues
The app works without MongoDB! Just leave `MONGODB_URI` empty in `server/.env`.

