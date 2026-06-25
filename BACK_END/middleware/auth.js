import jwt from "jsonwebtoken";

/**
 * Verifies the JWT from the Authorization header and attaches the
 * decoded payload to `req.user`.  Returns `null` on success, or a
 * JSON error response if the token is missing / invalid.
 */
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Please login" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return decoded;
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return null;
  }
};

export const authMiddleware = (req, res, next) => {
  const decoded = verifyToken(req, res);
  if (decoded) next();
};

export const adminMiddleware = (req, res, next) => {
  const decoded = verifyToken(req, res);
  if (!decoded) return;

  if (!decoded.is_admin) {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};