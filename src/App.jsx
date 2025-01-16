import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./pages/Chat";
import ChatDetail from "./pages/ChatDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute>}/>
        <Route path="/chat" element={ <PrivateRoute> <Chat /> </PrivateRoute>}/>
        <Route path="/chat/:id" element={<PrivateRoute> <ChatDetail /> </PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App; 