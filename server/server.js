const app = require('./app.js');
const connectDB = require('./config/database.js');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5030;

// Connect to database (optional - falls back to in-memory if unavailable)
// Wait for initialization before starting server
connectDB().then(async (result) => {
  if (result.useInMemory) {
    console.log('📦 Running in in-memory mode (no database connection)');
    // Ensure data is fully initialized
    const { ensureDataInitialized } = require('./storage/inMemoryStore.js');
    await ensureDataInitialized();
    console.log('✅ In-memory data ready');
  }
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });
  
  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    // Join room for chat between two users
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });
  
    // Handle chat messages
    socket.on('send-message', async (data) => {
      try {
        // Broadcast to room
        io.to(data.roomId).emit('receive-message', {
          sender: data.sender,
          message: data.message,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Socket error:', error);
      }
    });
  
    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('user-typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  // Make io available to routes if needed
  app.set('io', io);
  
  // Start server
  httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});

