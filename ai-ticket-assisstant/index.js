import express from "express";
import cors from "cors";
import db from "./config/db.js";
import userRoutes from "./routes/userRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

db();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is running on port ${port}...🔥`);
});
