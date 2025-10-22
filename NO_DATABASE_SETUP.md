# Running Without Database

This application can now run **without a MongoDB connection**! It will automatically use in-memory storage with sample data.

## Quick Start (No Database Required)

1. **Backend Setup:**
```bash
cd server
npm install
```

2. **Create `.env` file** (MongoDB URI and JWT_SECRET are optional):
```env
PORT=5000
NODE_ENV=development
# MONGODB_URI=  # Leave empty or omit to use in-memory storage
# JWT_SECRET=  # Optional - will use default if not set (with warning)
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key-here
AI_API_URL=https://api.openai.com/v1/chat/completions
CLIENT_URL=http://localhost:5173
```

> **Note:** If `JWT_SECRET` is not set, the app will use a default secret and show a warning. For production, always set a strong `JWT_SECRET`!

3. **Start Server:**
```bash
npm run dev
```

The server will detect that MongoDB is not available and automatically switch to in-memory storage with sample data.

## Sample Accounts

The in-memory storage includes these pre-configured accounts:

### Patient Account
- **Email:** `patient@example.com`
- **Password:** `password123`
- **Role:** Patient

### Doctor Accounts
- **Email:** `doctor@example.com`
- **Password:** `password123`
- **Role:** Doctor (Cardiology)

- **Email:** `doctor2@example.com`
- **Password:** `password123`
- **Role:** Doctor (General Medicine)

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `password123`
- **Role:** Admin

## Sample Data Included

- ✅ 4 pre-configured users (1 patient, 2 doctors, 1 admin)
- ✅ 2 sample appointments
- ✅ 1 sample AI analysis
- ✅ All data persists during server runtime

## How It Works

1. **Database Connection Check:** The app tries to connect to MongoDB
2. **Fallback to In-Memory:** If connection fails or URI is empty, it uses in-memory storage
3. **Sample Data:** Pre-loaded sample data is available immediately
4. **Full Functionality:** All features work the same way

## Notes

- **Data Persistence:** In-memory data is lost when the server restarts
- **Multiple Users:** You can still register new users - they'll be stored in memory
- **Production:** For production, use MongoDB for persistent storage
- **Testing:** Perfect for development and testing without database setup

## Switching to MongoDB

To use MongoDB instead:

1. Set up MongoDB (local or Atlas)
2. Add `MONGODB_URI` to `.env`
3. Restart the server
4. The app will automatically use MongoDB

The application seamlessly switches between storage modes!

