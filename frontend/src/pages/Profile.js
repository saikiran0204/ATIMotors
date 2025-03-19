import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/user");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Profile</h2>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-4"><strong>Role:</strong> {user.role}</p>
        <Link to="/dashboard" className="text-blue-500 underline hover:text-blue-700">Back to Dashboard</Link>
      </div>
    </div>
  );
}
