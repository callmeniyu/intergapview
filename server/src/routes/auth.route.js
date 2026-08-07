import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserDetails } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route /api/auth/register
 * @description registers new user.
 * @access Public
 */

authRouter.post("/register", registerUser);

/**
 * @route /api/auth/login
 * @description log in existing user.
 * @access Public
 */
authRouter.post("/login", loginUser);

/**
 * @route /api/auth/logout
 * @description logout current user.
 * @access Public
 */
authRouter.get("/logout", authUser, logoutUser);

/**
 * @route /api/auth/get-me
 * @description Fetch user details for sessions management.
 * @access Public
 */
authRouter.get("/get-me", authUser, getUserDetails);

export default authRouter;
