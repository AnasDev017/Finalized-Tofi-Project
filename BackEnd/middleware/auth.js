import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  let access_token = req.cookies.access_token;
  
  if (!access_token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7);
    }
  }

  if (!access_token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
