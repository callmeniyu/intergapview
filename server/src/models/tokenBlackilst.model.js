import mongoose from "mongoose";

const tokenBlacklistSchema = mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
      required: [true, "token is required."],
    },
  },
  { timestamps: true },
);

const tokenBlacklist = mongoose.model("tokenBlacklists", tokenBlacklistSchema);

export default tokenBlacklist;
