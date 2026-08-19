import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenBlacklist from "../models/tokenBlackilst.model.js";

/**
 * @name registerUser
 * @description registers new user, expect username, password and email.
 * @access Public
 */
const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide email, username and password." });
    }

    const isUserExisting = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExisting) {
      return res.status(409).json({ message: "Account already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("newUser", newUser);

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).json({
      message: "Registered new user succesfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });

    console.log("Registered new user succesfully", {
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });

    console.log("New user has successfully registered.");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @name loginUser
 * @description log in existing user, expect username, password and email.
 * @access Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User not registered. Please signup first.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({
      message: "User logged in succesfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    console.log("Logged in user succesfully", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
/**
 * @name logoutUser
 * @description logout current user. Expects token
 * @access Public
 */
const logoutUser = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      await tokenBlacklist.create({ token });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
    console.log("User succesfully logged out");
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.log(error);
  }
};

/**
 * @name getUserDetails
 * @description fetch user details using id decoded from token, expect token from auth.middleware.
 * @access Private
 */
const getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "No such user found" });
    }

    res.status(200).json({ message: "User details fetched", user });
    console.log("Registered new user succesfully", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export { registerUser, loginUser, logoutUser, getUserDetails };
