import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import API from "./api/axiosInstance";
import { setUser, logout } from "./store/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile"; 

export default function App() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await API.get("/auth/user");
          dispatch(setUser(res.data)); // Store user details in Redux
        } catch (error) {
          dispatch(logout()); // Invalid token, log out user
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token, dispatch]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        {/* Handle Root Route */}
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />

        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />

        {/* Handle 404 - Unknown Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
