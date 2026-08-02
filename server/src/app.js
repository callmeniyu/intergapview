import "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hiii");
});

export default app;
