import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axiosInstance";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const [comment, setComment] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const user = useSelector((state) => state.auth.user);
  
  

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets");
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      await API.post("/tickets/create", newTicket);
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await API.delete(`/tickets/delete/${ticketId}`);
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleAddComment = async (ticketId) => {
    try {
      const res = await API.post(`/tickets/comment/${ticketId}`, { comment });
      setTickets(tickets.map(ticket => ticket.id === ticketId ? { ...ticket, comments: res.data } : ticket));
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, comments: res.data });
      }
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleChangeStatus = async (ticketId, status) => {
    try {
      await API.put(`/tickets/change-status/${ticketId}`, { status });
      setTickets(tickets.map(ticket => ticket.id === ticketId ? { ...ticket, status } : ticket));
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleAssignTicket = async (ticketId) => {
    try {
      await API.put(`/tickets/assign/${ticketId}`, { assigned_to: assignEmail });
      setTickets(tickets.map(ticket => ticket.id === ticketId ? { ...ticket, assigned_to: assignEmail } : ticket));
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, assigned_to: assignEmail });
      }
      setAssignEmail("");
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      {user.role === "customer" && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-lg font-semibold mb-2">Create New Ticket</h2>
          <input
            type="text"
            placeholder="Title"
            value={newTicket.title}
            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            className="block w-full p-2 my-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            className="block w-full p-2 my-2 border rounded"
          />
          <button onClick={handleCreateTicket} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Create Ticket
          </button>
        </div>
      )}
      <div>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="p-4 border my-2 rounded-lg cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                onClick={() => { setSelectedTicket(ticket); setShowPopup(true); }}
              >
                <div>
                  <strong>{ticket.title}</strong> - {ticket.status}
                </div>
                {user.role === "customer" && ticket.status === "completed" && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteTicket(ticket.id); }} className="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {showPopup && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-2">{selectedTicket.title}</h2>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            <p><strong>Created At:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
            <p><strong>Assignee:</strong> {selectedTicket.assigned_to ? selectedTicket.assigned_to : "Unassigned"}</p>
            <h3 className="mt-4 text-lg font-semibold">Comments</h3>
            <ul className="border p-2 rounded bg-gray-100 mb-2">
              {selectedTicket.comments.length > 0 ? (
                selectedTicket.comments.map((comment, index) => (
                  <li key={index} className="p-2 border-b">{comment}</li>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </ul>
            {(user.role === "customer" || user.role === "agent" || user.role === "admin") && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block w-full p-2 border rounded"
                />
                <button onClick={() => handleAddComment(selectedTicket.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                  Add Comment
                </button>
              </div>
            )}
            {user.role === "agent" && (
              <button onClick={() => handleChangeStatus(selectedTicket.id, "completed")} className="bg-green-500 text-white px-4 py-2 rounded-md mt-2">
                Mark as Completed
              </button>
            )}
            {user.role === "admin" && (
              <div className="mt-2">
                <input type="email" placeholder="Assign to (email)" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} className="block w-full p-2 border rounded" />
                <button onClick={() => handleAssignTicket(selectedTicket.id)} className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-2">
                  Assign Ticket
                </button>
              </div>
            )}
            <button onClick={() => { setShowPopup(false); setSelectedTicket(null); }} className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
