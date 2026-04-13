import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./RFRoom.css";
import axios from "axios";

export default function RoomChat() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const bottomRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 create socket inside component
  const socket = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/${roomId}`,
        );

        const formatted = res.data.map((msg) => ({
          ...msg,
          isMine: msg.user === user?.name,
        }));

        setMessages(formatted);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [roomId]);

  /* =========================
     CONNECT + JOIN ROOM
  ========================== */
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL);

    socket.current.emit("join_room", {
      roomId,
      user,
    });

    socket.current.on("room_users", (users) => {
      setRoomUsers(users);
    });

    socket.current.on("receive_room_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          isMine: data.user === user?.name,
        },
      ]);
    });

    // 🔥 CLEANUP (VERY IMPORTANT)
    return () => {
      socket.current.emit("leave_room", roomId);
      socket.current.disconnect();
    };
  }, [roomId]);

  /* =========================
     AUTO SCROLL
  ========================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================== */
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      room: roomId,
      user: user?.name,
      avatar: user?.avatar,
      message: input,
      time: new Date().toLocaleTimeString(),
    };

    socket.current.emit("send_room_message", msg);

    setInput("");
  };

    const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="rf-room-chat-container">
      <div className="rf-room-header">
        <h3>
          Room: <span style={{ color: "yellow" }}>{roomId}</span>
        </h3>
        <div className="rf-room-users">
          {roomUsers.map((u) => (
            <div key={u.id} className="rf-room-user-item">
              <span className="onlineuser-name">{u.name},</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rf-room-messages-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rf-room-message-bubble ${
              msg.isMine ? "rf-room-message-mine" : ""
            }`}
          >
            {!msg.isMine && <span className="rf-room-user">{msg.user}</span>}

            <p>{msg.message}</p>

            <span className="rf-room-time">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="rf-room-input-container">
        <input
          className="rf-room-message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          onKeyDown={handleKeyDown}
        />
        <button className="rf-room-send-btn" onClick={sendMessage}>
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
}
