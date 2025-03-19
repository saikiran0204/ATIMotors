import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Link } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();

  return (
    <nav className="p-4 shadow-md flex justify-between items-center bg-blue-600 text-white">
      <Link to="/dashboard" className="text-xl font-bold hover:text-gray-200">Support</Link>
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="hover:text-gray-200">Profile</Link>
        <button 
          onClick={() => dispatch(logout())} 
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
