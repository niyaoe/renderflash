import React from "react";
import "./ChatHome.css";
import { useNavigate } from "react-router-dom";

export default function ChatHome() {
  const navigate = useNavigate();

  return (
    <div className="rf-chat-home">

      <h2 className="rf-chat-home-title">Community</h2>

      <div className="rf-chat-home-options">

        {/* GLOBAL CHAT */}
        <div
          className="rf-chat-card-option"
          onClick={() => navigate("/main/chat/global")}
        >
          <i className="bi bi-globe2"></i>
          <h3>Global Chat</h3>
          <p>Chat with everyone</p>
        </div>

        {/* PRIVATE CHAT */}
        <div
          className="rf-chat-card-option"
          onClick={() => navigate("/main/chat/private")}
        >
          <i className="bi bi-person-lines-fill"></i>
          <h3>Rooms</h3>
          <p>Chat with your friends</p>
        </div>

      </div>
    </div>
  );
}