import express from "express";
import cors from "cors";
import db from "./config/db.js";
import { serve } from "inngest/express";
import userRoutes from "./routes/userRoute.js";
import ticketRoutes from "./routes/ticketRoute.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/signUp.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

//inngest
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated],
  })
);

db();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is running on port ${port}...🔥`);
});
