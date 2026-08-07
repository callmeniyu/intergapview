import jwt from "jsonwebtoken";
import tokenBlacklist from "../models/tokenBlackilst.model.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Token not provided." });
    }

    const isTokenBlacklisted = await tokenBlacklist.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({ message: "Invalid user token" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
