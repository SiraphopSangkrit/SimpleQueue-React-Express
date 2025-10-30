const mongoose = require("mongoose");
const UserModel = require("../Models/User");
require("dotenv").config();

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to MongoDB");
    
   
    const existingAdmin = await UserModel.findOne({ 
      $or: [
        { email: "admin@example.com" },
        { username: "admin" }
      ]
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Username:", existingAdmin.username);
      process.exit(0);
    }

    const adminUser = new UserModel({
      email: "admin@example.com",
      username: "admin", 
      password: "password",
      name: "Administrator",
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Username: admin");
    console.log("Password: password");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();