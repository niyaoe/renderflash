import { useState, useEffect, useRef } from "react";
import "./RFGlobalChat.css";
import { io } from "socket.io-client";
import axios from "axios";
import { API_URL } from "../../../../utils/api";

//  CONNECT BACKEND
const socket = io(`${API_URL}`, {
  transports: ["websocket"],
});

export default function GlobalChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  //  GET CURRENT USER (from localStorage / auth)
  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    name: "guest",
    avatar: "https://i.pravatar.cc/100?img=32",
  };
  console.log(JSON.parse(localStorage.getItem("user")));

  /* =========================
     LOAD OLD MESSAGES (API)
  ========================== */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages`);

        const formatted = res.data.map((msg) => ({
          ...msg,
          isMine: msg.user === currentUser.username,
        }));

        setMessages(formatted);
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    fetchMessages();
  }, []);

  /* =========================
     CONNECT SOCKET
  ========================== */
  useEffect(() => {
    // console.log(currentUser);
    // console.log({
    //   user: currentUser.name,
    //   avatar: currentUser.avatar,
    //   message: input,
    // });
    socket.emit("join_global");

    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          isMine: data.user === currentUser.username,
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, []);

  /* =========================
     AUTO SCROLL
  ========================== */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================== */
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      user: currentUser.username,
      message: input,
      avatar: currentUser.avatar,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // SEND TO SERVER
    socket.emit("send_message", newMessage);

    // INSTANT UI
    // setMessages((prev) => [
    //   ...prev,
    //   { ...newMessage, isMine: true },
    // ]);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="rf-chat-container">
      {/* messages */}
      <div className="rf-chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`rf-chat-message ${msg.isMine ? "rf-chat-mine" : ""}`}
          >
            {!msg.isMine && (
              <img src={msg.avatar} className="rf-chat-avatar" alt="avatar" />
            )}

            <div className="rf-chat-bubble">
              {!msg.isMine && <span className="rf-chat-user">{msg.user}</span>}

              <p className="rf-chat-text">{msg.message}</p>

              <span className="rf-chat-time">{msg.time}</span>
            </div>
          </div>
        ))}

        <div ref={chatEndRef}></div>
      </div>

      {/* input */}
      <div className="rf-chat-input-wrapper">
        <input
          className="rf-chat-input"
          placeholder="Send anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button className="rf-chat-send-btn" onClick={sendMessage}>
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
}
