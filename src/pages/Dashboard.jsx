import React from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../components/GetCookie";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = getCookie("authToken");

  if (!token) {
    navigate("/login");
  }
  const userName = getCookie("userName");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome!!!!, {userName}</h2>
          <button
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => navigate("/chat")}
          >
            Start Chat
          </button>
        </div>
      </div>
  );
};

export default Dashboard;
