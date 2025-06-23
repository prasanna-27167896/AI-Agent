import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketTitle, setSelectedTicketTitle] = useState(null);

  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/signup"); // 🔁 or "/login"
        return;
      }

      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/signup"); // 🔁 or "/login"
        return;
      }

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets();
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Delete

  const deleteTicketAPI = async (id, token) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Delete failed:", data.message || data.error);
        return false;
      }

      console.log("Ticket deleted:", data);
      return true;
    } catch (error) {
      console.error("Delete request error:", error.message);
      return false;
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const deleted = await deleteTicketAPI(id, token);
    if (deleted) {
      await fetchTickets();
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
      <div className="space-y-3">
        <>
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="card relative shadow-md p-4 bg-gray-800"
            >
              {/* Delete Button in Top-Right Corner */}
              <Trash2
                className="absolute top-2 right-2 text-white-500 text-xs hover:text-red-700 cursor-pointer size-5"
                title="Delete Ticket"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent Link navigation
                  e.preventDefault(); // Prevent Link navigation
                  console.log("Delete icon clicked", ticket._id);
                  setSelectedTicketId(ticket._id);
                  setSelectedTicketTitle(ticket.title);
                  setShowModal(true);
                }}
              />

              {/* Ticket Content */}
              <Link to={`/tickets/${ticket._id}`} className="block space-y-1">
                <h3 className="font-bold text-lg">{ticket.title}</h3>
                <p className="text-sm">{ticket.description}</p>
                <p className="text-sm text-gray-500">
                  Created At: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </Link>
            </div>
          ))}
          {showModal && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-[90%] max-w-sm relative">
                {/* Close icon */}
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  ✖
                </button>

                {/* Icon + Message */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-black dark:text-white text-3xl">⚠️</div>
                  <p className="text-lg text-gray-800 dark:text-gray-100 font-medium">
                    Are you sure you want to delete
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    {selectedTicketTitle}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-center mt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        const token = localStorage.getItem("token");
                        const deleted = await deleteTicketAPI(
                          selectedTicketId,
                          token
                        );
                        if (deleted) {
                          setShowModal(false);
                          fetchTickets();
                        }
                      }}
                      className="btn btn-primary"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
        {tickets.length === 0 && <p>No tickets submitted yet.</p>}
      </div>
    </div>
  );
}
