import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "TODO" },
  createdBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: String,
  },
  assignedTo: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    type: String,
    default: null,
  },
  priority: String,
  deadline: String,
  helpfulNotes: String,
  relatedSkills: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);
