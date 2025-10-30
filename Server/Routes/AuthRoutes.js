const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/AuthController");
const { authenticateToken } = require("../Middleware/auth");

const authController = new AuthController();

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);
router.put("/change-password", authenticateToken, authController.changePassword);

module.exports = router;