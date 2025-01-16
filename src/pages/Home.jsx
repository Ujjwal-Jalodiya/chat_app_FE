import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 text-center">
      <div className="space-x-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
            Register
          </button>
        </Link>
      </div>
    </div>
    </div>
  );
}

export default Home;