import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; 
import { getCookie } from "../components/GetCookie";
import { createConsumer } from "@rails/actioncable";

const ChatDetail = () => {
  const { id } = useParams(); 
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Reference to the message container div
  const messageEndRef = useRef(null);

  useEffect(() => {
    const fetchChatDetail = async () => {
      try {
        const token = getCookie("authToken");
        const response = await fetch(`https://chat-app-be-gltx.onrender.com/chats/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chat details");
        }

        const data = await response.json();
        setChat(data.data);
        setMessages(data.data.attributes.messages);

        // Set current user dynamically
        const currentUserId =
          data.data.attributes.user.id === data.data.attributes.user1_id
            ? data.data.attributes.user2_id
            : data.data.attributes.user1_id;
        setCurrentUser(currentUserId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatDetail();

    const cable = createConsumer("wss://https://chat-app-be-gltx.onrender.com/cable");
    const channel = cable.subscriptions.create(
      { channel: "MessagesChannel", chat_id: id },
      {
        received: (data) => {
          // Make sure the received message is valid before using it
          setMessages((prevMessages) => {
            if (data?.message_id && !prevMessages.some((msg) => msg?.id === data.message_id)) {
              return [
                ...prevMessages,
                {
                  content: data.content,
                  user_id: data.user_id,
                  id: data.message_id,
                },
              ];
            }
            return prevMessages; // No update if the message is already in the list
          });
        },
      }
    );

    setSocket(channel);

    return () => {
      if (socket) {
        socket.unsubscribe();
      }
    };
  }, [id]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const token = getCookie("authToken");
      const response = await fetch(`https://chat-app-be-gltx.onrender.com/messages`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: id,
          content: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMessage = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage.data,
      ]);
      setMessage("");

      socket.send(
        JSON.stringify({
          type: "message",
          content: message,
          chat_id: id,
          user_id: currentUser,
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Loading chat...</p>
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

<div className="w-full sm:w-96 bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-4">
  {/* Displaying user's name at the top */}
  <h2 className="text-xl font-semibold text-gray-800 ">
    {chat?.attributes?.user?.name || "User"}
  </h2>

  {/* Underline div */}
  <div className="border-b-2 border-gray-300 mb-4"></div>

  {/* Displaying messages */}
  <div className="flex flex-col space-y-4 overflow-y-auto max-h-[60vh] py-4">
    {messages.length === 0 ? (
      <p className="text-center text-gray-500">No messages yet</p>
    ) : (
      messages.map((message) =>
        message?.id && message?.user_id !== undefined ? (
          <div
            key={message.id}
            className={`flex ${
              message.user_id === currentUser
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 max-w-xs rounded-xl shadow-md ${
                message.user_id === currentUser
                  ? "bg-gray-300 text-black"
                  : "bg-blue-500 text-white"
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ) : null
      )
    )}
    {/* Scroll indicator */}
    <div ref={messageEndRef} />
  </div>

  {/* Message input and send button */}
  <div className="flex items-center space-x-2 mt-4">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message..."
      className="flex-1 p-2 border rounded-xl text-sm focus:outline-none"
    />
    <button
      onClick={handleSendMessage}
      className="bg-blue-500 text-white p-2 rounded-lg text-sm font-semibold hover:bg-blue-600"
    >
      Send
    </button>
  </div>
</div>
    </div>
  );
};

export default ChatDetail;
