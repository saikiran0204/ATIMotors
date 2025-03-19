import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store/authSlice";
import API from "../api/axiosInstance";
import { useNavigate, useHistory } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.access_token) {
        dispatch(setToken(res.data.access_token));
        window.location = '/';
      }
      
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block border border-gray-300 p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block border border-gray-300 p-3 rounded-md w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition duration-300">
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 underline hover:text-blue-700">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
