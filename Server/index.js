// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const port = process.env.PORT || 3000;

// Initialize MongoDB connection
const db = require('./Configs/mongodb');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("tiny"));
// Routes
const UserRoutes= require('./Routes/UserRoutes');
app.use('/api/users', UserRoutes);
const QueueRoutes = require('./Routes/QueueRoutes');
app.use('/api/queues', QueueRoutes);
const SettingRoutes = require('./Routes/SettingRoutes');
app.use('/api/settings', SettingRoutes);

app.use('/api/customers', require('./Routes/CustomerRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: port,
    message: 'Server is running successfully'
  });
});

// Handle MongoDB connection events
db.on('connected', () => {
  console.log('MongoDB connected successfully');
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
  console.log(`Also accessible via http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
});