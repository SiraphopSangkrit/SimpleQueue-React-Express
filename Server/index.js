// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Initialize MongoDB connection
const db = require('./Configs/mongodb');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const UserRoutes= require('./Routes/UserRoutes');
app.use('/api/users', UserRoutes);
const QueueRoutes = require('./Routes/QueueRoutes');
app.use('/api/queues', QueueRoutes);
const SettingRoutes = require('./Routes/SettingRoutes');
app.use('/api/settings', SettingRoutes);

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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});