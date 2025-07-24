const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes

// Import database connection
const db = require('./config/db');

// Process ID management
const PID_FILE = path.join(__dirname, '.server-pid');

// Function to cleanup previous instance if it exists
const cleanupPreviousInstance = () => {
    try {
        if (fs.existsSync(PID_FILE)) {
            const previousPid = fs.readFileSync(PID_FILE, 'utf8');
            try {
                process.kill(previousPid);
                console.log(`Cleaned up previous instance (PID: ${previousPid})`);
            } catch (e) {
                // Process might not exist anymore, which is fine
            }
            fs.unlinkSync(PID_FILE);
        }
    } catch (error) {
        console.error('Error cleaning up previous instance:', error);
    }
};

// Save current process ID
const saveCurrentPid = () => {
    try {
        fs.writeFileSync(PID_FILE, process.pid.toString());
        console.log(`Current process ID (${process.pid}) saved`);
    } catch (error) {
        console.error('Error saving process ID:', error);
    }
};

// Clean up when server stops
const cleanup = () => {
    try {
        if (fs.existsSync(PID_FILE)) {
            fs.unlinkSync(PID_FILE);
        }
        if (server) {
            server.close(() => {
                console.log('Server closed successfully');
                process.exit(0);
            });

            // Force close after 5 seconds
            setTimeout(() => {
                console.error('Could not close server gracefully, forcing shutdown');
                process.exit(1);
            }, 5000);
        } else {
            process.exit(0);
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Mount admin routes

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Anonymous Messaging API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
});

// Clean up any previous instance before starting
cleanupPreviousInstance();

const PORT = process.env.PORT || 5000;
let server;

// Start server with automatic port management
const startServer = async () => {
    try {
        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            // Save the current process ID after successful start
            saveCurrentPid();
        });

        // Handle server-specific errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is busy, attempting cleanup...`);
                cleanupPreviousInstance();
                // Try starting again after a short delay
                setTimeout(startServer, 1000);
            } else {
                console.error('Server error:', error);
                cleanup();
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        cleanup();
    }
};

// Handle various shutdown signals
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    cleanup();
});
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    cleanup();
});

// Start the server
startServer(); 