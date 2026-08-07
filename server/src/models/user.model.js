import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const User = mongoose.model("users", userSchema);

export default User;
