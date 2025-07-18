const mongoose = require("mongoose");

// MongoDB connection URL - you can set this in environment variables
const MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost:27017/simplequeue";

// Connect to MongoDB (removed deprecated options)
mongoose.connect(MONGO_DB_URL);

const db = mongoose.connection;

module.exports = db;



