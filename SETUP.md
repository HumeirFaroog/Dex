# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key-here
AI_API_URL=https://api.openai.com/v1/chat/completions
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Start server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `mongodb://localhost:27017/healthcare`

**Option B: MongoDB Atlas (Cloud)**
- Create account at mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Use: `mongodb+srv://username:password@cluster.mongodb.net/healthcare`

### 4. OpenAI API Setup

1. Go to platform.openai.com
2. Create account and get API key
3. Add to `server/.env` as `OPENAI_API_KEY`

## First User Setup

1. Register as patient at `/register`
2. For admin/doctor roles, either:
   - Register and update role in database, OR
   - Use MongoDB to create admin user directly

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## Production Deployment

### Environment Variables

**Backend (.env):**
- Use strong JWT_SECRET (32+ characters)
- Set NODE_ENV=production
- Use MongoDB Atlas connection string
- Set proper CLIENT_URL

**Frontend (.env):**
- Set VITE_API_URL to production backend URL
- Set VITE_SOCKET_URL to production WebSocket URL

### Security Checklist
- [ ] Strong JWT secret
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database credentials secured
- [ ] API keys secured

