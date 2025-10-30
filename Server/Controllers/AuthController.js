const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "กรุณากรอกอีเมลและรหัสผ่าน",
        });
      }

      // Find user by email or username
      const user = await UserModel.findOne({ 
        $or: [{ email }, { username: email }],
        isActive: true 
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          username: user.username,
          role: user.role 
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      // Set HTTP-only cookie
      const cookieOptions = {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        path: '/'
      };

      res.cookie('authToken', token, cookieOptions);

      res.json({
        success: true,
        message: "เข้าสู่ระบบสำเร็จ",
        data: {
          user: user.toJSON(),
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        error: error.message,
      });
    }
  }

  // Register (for creating admin users)
  async register(req, res) {
    try {
      const { email, password, username, name, role = "admin" } = req.body;

      // Validation
      if (!email || !password || !username) {
        return res.status(400).json({
          success: false,
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        });
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว",
        });
      }

      // Create new user
      const user = new UserModel({
        email,
        password,
        username,
        name: name || username,
        role,
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: "สร้างบัญชีผู้ใช้สำเร็จ",
        data: {
          user: user.toJSON(),
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการสร้างบัญชี",
        error: error.message,
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "ไม่พบข้อมูลผู้ใช้",
        });
      }

      res.json({
        success: true,
        data: {
          user: user.toJSON(),
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        error: error.message,
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "กรุณากรอกรหัสผ่านเดิมและรหัสผ่านใหม่",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "ไม่พบข้อมูลผู้ใช้",
        });
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "รหัสผ่านเดิมไม่ถูกต้อง",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "เปลี่ยนรหัสผ่านสำเร็จ",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
        error: error.message,
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      // Clear the HTTP-only cookie
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });

      res.json({
        success: true,
        message: "ออกจากระบบสำเร็จ",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการออกจากระบบ",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;