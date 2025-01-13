import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized user" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};


export const authAdmin = async (req, res, next) => {
  try {
    // Get the token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has the 'ADMIN' role
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    // Attach the decoded user info to the request object
    req.user = decoded;
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};