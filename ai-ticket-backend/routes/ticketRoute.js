import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  createTicket,
  deleteTicket,
  getTicket,
  getTickets,
} from "../controllers/ticketController.js";

const router = express.Router();

router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicket);
router.post("/", authenticate, createTicket);
router.delete("/:id", authenticate, deleteTicket);

export default router;
