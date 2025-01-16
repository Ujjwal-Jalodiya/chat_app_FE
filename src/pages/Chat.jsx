import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../components/GetCookie";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to another page

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = getCookie("authToken");
        const response = await fetch("https://chat-app-be-gltx.onrender.com/chats", {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();
        setChats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Chats</h2>
      <div className="w-full sm:w-96 bg-white rounded-lg shadow-lg">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No chats available</p>
        ) : (
          <ul>
            {chats.map((chat) => (
              <li
                key={chat.id}
                className="flex items-center space-x-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleChatClick(chat.id)} // On chat click, navigate to the chat detail page
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {chat.attributes.user.name}
                  </p>

                  <p className="text-sm text-gray-500 truncate">
                    {chat.attributes.last_message && chat.attributes.last_message.content ? chat.attributes.last_message.content : "No messages yet"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Chat;
