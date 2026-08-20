import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./routes/interview.route.js";

const app = express();

console.log(process.env.ORIGIN);

app.use(
  cors({
    origin: process.env.ORIGIN || "https://intergapview-suw5.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/health", (req, res) => {
  res.send("Running");
});
app.use("/api/auth", authRouter);
app.use("/api/interview/", interviewRouter);

export default app;
