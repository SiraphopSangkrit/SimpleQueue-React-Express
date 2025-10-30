const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const authenticateToken = async (req, res, next) => {
  try {
    // Try to get token from HTTP-only cookie first, then fallback to Authorization header
    let token = req.cookies?.authToken;
    
    if (!token) {
      const authHeader = req.headers["authorization"];
      token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "ไม่พบ token การยืนยันตัวตน",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Verify user still exists and is active
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Token ไม่ถูกต้องหรือผู้ใช้ถูกระงับ",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token หมดอายุ กรุณาเข้าสู่ระบบใหม่",
      });
    }
    
    return res.status(403).json({
      success: false,
      message: "Token ไม่ถูกต้อง",
    });
  }
};


const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "กรุณาเข้าสู่ระบบ",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "ไม่มีสิทธิ์เข้าถึง",
      });
    }

    next();
  };
};

module.exports = { authenticateToken, requireRole };