import React, { useContext, useState } from "react";
import axios from "../auth/axiosConfig";
import { AppContext } from "../store/StoreContext";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logo.jpg';

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false); // Default loading state should be false
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the signin process starts
    try {
      console.log(email)
      const res = await axios.post("/api/v1/admin/login", { email, password });
      if (res.data) {
        localStorage.setItem("token", res.data.token);
        setUser(true);
        navigate("/");
      }
      console.log(res)
    } catch (err) {
      console.log(err);
      setError(err.response?.data.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-poppins">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <img src={Logo} className="h-auto w-[200px] mb-4" alt="Logo" />
        </div>
        <p className="text-gray-500 mb-4">
          Sign in to access your Admin Panel
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSignin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-main rounded-lg shadow-md focus:ring-4 focus:ring-green-300"
          >
            {loading ? "Signing in..." : "Signin"} {/* Corrected the button text */}
          </button>
        </form>
      </div>
    </div>
  );
}
