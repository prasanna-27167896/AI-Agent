import express from "express";
import cors from "cors";
import db from "./utils/db.js";

const app = express();

app.use(cors());
app.use(express.json());

db();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
