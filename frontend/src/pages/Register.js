import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");  // Default role: customer
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { email, password, role });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <form onSubmit={handleRegister} className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block border border-gray-300 p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block border border-gray-300 p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Role Dropdown */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block border border-gray-300 p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-green-500 text-white px-4 py-2 rounded-md w-full hover:bg-green-600 transition duration-300">
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 underline hover:text-green-700">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
