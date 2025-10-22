# Installation Guide

## One-Command Installation

Simply run from the root directory:

```bash
npm install
```

That's it! This single command installs all dependencies for:
- ✅ Root package (concurrently, etc.)
- ✅ Server package (Express, MongoDB, Socket.io, etc.)
- ✅ Client package (React, Vite, Tailwind, etc.)

## How It Works

This project uses **npm workspaces**, which means:
- All `package.json` files are linked together
- Running `npm install` from the root automatically installs dependencies for all workspaces
- No need to manually install in each directory

## Alternative Commands

For backward compatibility, you can also use:

```bash
npm run install:all
```

This does the same thing as `npm install`.

## After Installation

Once installation is complete, you can:

1. **Start development servers:**
   ```bash
   npm run dev
   ```

2. **Or start them separately:**
   ```bash
   npm run dev:server  # Backend only
   npm run dev:client  # Frontend only
   ```

## Troubleshooting

If you encounter issues:

1. **Clear node_modules and reinstall:**
   ```bash
   npm run clean:install
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

3. **Check npm version:**
   ```bash
   npm --version  # Should be v9 or higher
   ```

## Manual Installation (Not Recommended)

If for some reason you need to install manually:

```bash
# Root
npm install

# Server
cd server
npm install
cd ..

# Client
cd client
npm install
cd ..
```

But this is unnecessary - just use `npm install` from the root!

