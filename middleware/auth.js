
import User from "../models/UserModel.js";
import { verifyAccessToken } from "../utils/generateTokens.js";

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token found",
    });
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from token
    const user = await User.findById(decoded?.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No user found with this token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);

      if (user && !user.isLocked) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
    }
  }

  next();
};

export { protect, authorize, optionalAuth };
