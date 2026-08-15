import "dotenv/config";
import app from "./app.js";
import connectToDB from "./config/db.js";
import { setServers } from "node:dns/promises";
import { generateInterviewReport } from "./services/ai.services.js";

const PORT = process.env.PORT;
const BACKEND_URL = process.env.BACKEND_URL;
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV == "development") {
  var url = `${BACKEND_URL}:${PORT}`;
  setServers(["1.1.1.1", "8.8.8.8"]);
} else if (NODE_ENV == "production") {
  url = BACKEND_URL;
}

//Connect to DB, File config/db.js
connectToDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${url}`);
});
