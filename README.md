# Healthcare AI Web Application

A complete, production-ready full-stack healthcare application with AI-powered symptom analysis, appointment management, and real-time chat functionality.

## Features

### Core Features
- **Patient Management**: Registration, profile management, appointment booking
- **AI Symptom Checker**: Text-based symptom analysis using AI (OpenAI API)
- **Appointment System**: Book, manage, and track appointments
- **Medical Reports**: Upload and analyze PDF/image medical reports
- **Real-time Chat**: Socket.io-based chat between doctors and patients
- **Role-based Access**: Separate dashboards for Patients, Doctors, and Admins
- **Dark Mode**: Full dark mode support with theme persistence
- **Responsive UI**: Mobile-friendly design with Tailwind CSS

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- Helmet.js for security headers
- HIPAA-like data handling practices

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.io Client
- Recharts (for analytics)
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT
- Bcrypt
- Helmet
- Express Rate Limit
- Express Validator

## Project Structure

```
healthcare/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/        # React contexts
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                 # Node.js backend
    ├── controllers/        # Route controllers
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middlewares/       # Custom middlewares
    ├── config/            # Configuration files
    ├── app.js
    └── server.js
```

## 📋 Complete Setup Guide

This guide will walk you through installing all required environments and running the project from scratch.

### Step 1: Install Prerequisites

#### 1.1 Install Node.js and npm

**Windows:**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Choose the LTS version (v18 or higher recommended)
3. Run the installer and follow the setup wizard
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```
   You should see versions like `v18.x.x` and `9.x.x` or higher

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

#### 1.2 Install MongoDB (Optional)

The application can run **without MongoDB** using in-memory storage. However, for production use, MongoDB is recommended.

**Option A: MongoDB Local Installation**

**Windows:**
1. Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Install as a Windows Service (recommended)
4. MongoDB will start automatically on port 27017

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Option B: MongoDB Atlas (Cloud - Free Tier Available)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use `0.0.0.0/0` for development)
6. Get your connection string

#### 1.3 Get OpenAI API Key (Optional - for AI features)

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (you'll need it for environment variables)

### Step 2: Clone or Download the Project

If you have the project in a repository:
```bash
git clone <repository-url>
cd healthcare
```

Or if you already have the project folder:
```bash
cd healthcare
```

### Step 3: Install Dependencies

**From the root directory, run:**
```bash
npm install
```

This single command will:
- Install root-level dependencies
- Install all server dependencies
- Install all client dependencies

> **Note:** This project uses npm workspaces, so `npm install` automatically installs dependencies for both client and server!

**Expected output:**
```
added 500+ packages in 30s
✅ All dependencies installed successfully!
```

**If you encounter errors:**
```bash
# Clean install (removes all node_modules and reinstalls)
npm run clean:install
```

### Step 4: Configure Environment Variables

#### 4.1 Backend Configuration

Create a file named `.env` in the `server/` directory:

```bash
# Navigate to server directory
cd server

# Create .env file (Windows)
type nul > .env

# Create .env file (macOS/Linux)
touch .env
```

Open `server/.env` and add the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Optional - leave empty for in-memory storage)
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/healthcare
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare
MONGODB_URI=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# OpenAI API Configuration (Optional - for AI features)
OPENAI_API_KEY=your-openai-api-key-here
AI_API_URL=https://api.openai.com/v1/chat/completions

# Client Configuration
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important Notes:**
- If `MONGODB_URI` is empty, the app will use in-memory storage with sample data
- Replace `JWT_SECRET` with a strong random string (at least 32 characters)
- Replace `OPENAI_API_KEY` with your actual OpenAI API key (if using AI features)
- For production, use much stronger secrets and secure your `.env` file

#### 4.2 Frontend Configuration

Create a file named `.env` in the `client/` directory:

```bash
# Navigate to client directory
cd client

# Create .env file (Windows)
type nul > .env

# Create .env file (macOS/Linux)
touch .env
```

Open `client/.env` and add the following:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Note:** If your backend runs on a different port, update `VITE_API_URL` accordingly.

### Step 5: Run the Project

#### 5.1 Run Both Frontend and Backend Together (Recommended)

From the **root directory**:

```bash
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend application** on `http://localhost:5173`

You should see output like:
```
[0] Server running on port 5000
[1] VITE v5.x.x  ready in 500 ms
[1] ➜  Local:   http://localhost:5173/
```

#### 5.2 Run Separately (Alternative)

**Backend only:**
```bash
npm run dev:server
```

**Frontend only (in a new terminal):**
```bash
npm run dev:client
```

### Step 6: Access the Application

1. **Open your browser** and navigate to:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

2. **Login with sample credentials** (if using in-memory storage):
   - **Patient:** `patient@example.com` / `password123`
   - **Doctor:** `doctor@example.com` / `password123`
   - **Admin:** `admin@example.com` / `password123`

3. **Or register a new account:**
   - Click "Register" on the login page
   - Fill in your details
   - Choose your role (patient, doctor, or admin)

### Step 7: Verify Everything Works

1. ✅ **Backend is running:** Check `http://localhost:5000/api` - should return API info
2. ✅ **Frontend is running:** Check `http://localhost:5173` - should show login page
3. ✅ **Database connection:** Check server console for "Connected to MongoDB" or "Using in-memory storage"
4. ✅ **Login works:** Try logging in with sample credentials
5. ✅ **Pages load:** Navigate through different pages in the application

## 🛠️ Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change the port in `server/.env`:
   ```env
   PORT=5001
   ```
2. Update `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_SOCKET_URL=http://localhost:5001
   ```
3. Restart the servers

### Dependencies Installation Fails

**Error:** `npm ERR!` or installation hangs

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
npm run clean:install

# Or manually:
rm -rf node_modules server/node_modules client/node_modules
npm install
```

### MongoDB Connection Issues

**Error:** `MongoNetworkError` or connection timeout

**Solutions:**
1. **Use in-memory storage** (easiest):
   - Leave `MONGODB_URI` empty in `server/.env`
   - The app will work without MongoDB

2. **Check MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   # or
   brew services list
   ```

3. **Verify connection string:**
   - Check `MONGODB_URI` format in `server/.env`
   - For Atlas, ensure IP is whitelisted

### Frontend Can't Connect to Backend

**Error:** `Network Error` or `Failed to fetch`

**Solutions:**
1. Ensure backend is running on port 5000
2. Check `VITE_API_URL` in `client/.env` matches backend URL
3. Check CORS settings in `server/app.js`
4. Verify `CLIENT_URL` in `server/.env` matches frontend URL

### Module Not Found Errors

**Error:** `Cannot find module 'xxx'`

**Solution:**
```bash
# Reinstall dependencies
npm run clean:install

# Or install missing package manually
npm install <package-name>
```

### OpenAI API Errors

**Error:** `Invalid API key` or `401 Unauthorized`

**Solutions:**
1. Verify `OPENAI_API_KEY` in `server/.env` is correct
2. Check API key has sufficient credits
3. AI features will be disabled if API key is invalid (app still works)

### Windows-Specific Issues

**PowerShell Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Path Length Issues:**
- Enable long paths in Windows settings
- Or use shorter directory names

## 📝 Available Scripts

From the root directory:

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies (root, server, client) |
| `npm run dev` | Run both server and client in development mode |
| `npm run dev:server` | Run only the backend server |
| `npm run dev:client` | Run only the frontend client |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the production server |
| `npm test` | Run all tests |
| `npm run clean` | Remove all node_modules and build files |
| `npm run clean:install` | Clean and reinstall everything |

## 🎯 Next Steps

After successful setup:

1. **Explore the application:**
   - Login as different roles (patient, doctor, admin)
   - Try the symptom checker
   - Book an appointment
   - Upload a medical report

2. **Read the documentation:**
   - [QUICK_START.md](./QUICK_START.md) - Quick reference
   - [NO_DATABASE_SETUP.md](./NO_DATABASE_SETUP.md) - Running without database
   - [API Endpoints](#api-endpoints) - API documentation

3. **Development:**
   - Make changes to the code
   - Hot reload is enabled - changes appear automatically
   - Check browser console and server logs for errors

## 💡 Tips

- **Development Mode:** Changes to code will automatically reload (hot reload)
- **No Database Needed:** The app works perfectly with in-memory storage
- **AI Features:** Optional - app works without OpenAI API key
- **Multiple Terminals:** You can run frontend and backend in separate terminals for better logs
- **Browser DevTools:** Use F12 to open developer tools for debugging

For additional help, check the troubleshooting section above or open an issue in the repository.

## Usage

### Creating Accounts

1. **Patient Account**: Register with role "patient"
2. **Doctor Account**: Register with role "doctor" (or update via admin)
3. **Admin Account**: Register with role "admin" (or update via database)

### Key Workflows

1. **Symptom Analysis**:
   - Patient navigates to Symptom Checker
   - Enters symptom description
   - AI analyzes and provides possible diagnoses
   - Results stored in database

2. **Appointment Booking**:
   - Patient selects doctor and time
   - Appointment created with pending status
   - Doctor can confirm/update appointment

3. **Report Upload**:
   - Patient uploads PDF/image report
   - System extracts text (for PDFs)
   - Can be analyzed with AI

4. **Real-time Chat**:
   - Available between doctors and patients
   - Uses Socket.io for real-time messaging

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Upload report
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### AI Analysis
- `POST /api/ai/symptoms` - Analyze symptoms
- `POST /api/ai/report` - Analyze report
- `GET /api/ai` - Get all analyses
- `GET /api/ai/:id` - Get analysis by ID
- `PUT /api/ai/:id` - Update analysis (doctor/admin)

### Users
- `GET /api/users` - Get all users (admin/doctor)
- `GET /api/users/stats` - Get dashboard stats
- `GET /api/users/trends` - Get health trends

## Testing

Testing is performed exclusively in controlled testing environments by authorized QA personnel. Local testing by developers is not permitted.

## Deployment

Deployment is managed exclusively by authorized DevOps personnel. All deployment processes, environment configurations, and infrastructure management are restricted to production environments only.

## Security Considerations

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regularly update dependencies
- Implement additional rate limiting for production
- Consider adding request logging and monitoring

## License

ISC

## Support

For issues and questions, please open an issue in the repository.

