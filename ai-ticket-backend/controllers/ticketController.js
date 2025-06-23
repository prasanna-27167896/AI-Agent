import { inngest } from "../inngest/client.js";
import ticket from "../models/ticket.js";
import Ticket from "../models/ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: (await newTicket)._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];

    if (user.role === "admin") {
      // Admin sees all tickets
      tickets = await Ticket.find({}).sort({ createdAt: -1 });
    } else if (user.role === "moderator") {
      console.log("Moderator Email:", req.user.email);

      // Moderator sees tickets assigned to them or created by them
      tickets = await Ticket.find({
        $or: [{ assignedTo: user.email }, { createdBy: user._id }],
      }).sort({ createdAt: -1 });
    } else {
      // Normal user sees only tickets they created
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id, //both must match
      }).select(
        "title description status createdAt helpfulNotes relatedSkills priority assignedTo"
      );
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(400).json({ message: "Ticket not found" });
    }

    // if (
    //   req.user.role !== "admin" &&
    //   req.user._id !== ticket.createdBy.toString()
    // ) {
    //   return res
    //     .status(403)
    //     .json({ message: "Unauthorized to delete this ticket" });
    // }

    res.status(200).json({
      message: "Ticket deleted successfully",
      deletedTicket: ticket,
    });
  } catch (error) {
    console.error("Error deleting ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
