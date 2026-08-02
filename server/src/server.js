import app from "./app.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3000;

//run server here

app.listen(PORT, () => {
  console.log(`Server is running on ${BACKEND_URL}${PORT}.`);
});
