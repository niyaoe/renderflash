import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../utils/api";
import "./RFRoom.css";

export default function PrivateRoomHome() {
  const [roomCode, setRoomCode] = useState("");
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     LOAD ROOMS
  ========================== */
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/rooms`);
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRooms();
  }, []);

  /* =========================
     CREATE ROOM
  ========================== */
  const createRoom = async () => {
    const code = Math.random().toString(36).substring(2, 8);

    try {
      await axios.post(`${API_URL}/api/rooms/create`, {
        roomId: code,
        user: user?.name,
      });

      navigate(`/main/chat/private/${code}`);
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
     JOIN ROOM
  ========================== */
  const joinRoom = () => {
    if (!roomCode.trim()) return;
    navigate(`/main/chat/private/${roomCode}`);
  };

  return (
    <div className="rf-room-home-container">

      <h2 className="rf-room-title">Private Rooms</h2>

      <div className="rf-room-actions-wrapper">

        <button
          className="rf-room-create-btn"
          onClick={createRoom}
        >
          Create Room
        </button>

        <div className="rf-room-join-box">
          <input
            className="rf-room-input"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button
            className="rf-room-join-btn"
            onClick={joinRoom}
          >
            Join
          </button>
        </div>

      </div>

      {/* =========================
         ROOM LIST
      ========================== */}
      {/* <div className="rf-room-list">

        <h3 className="rf-room-list-title">Available Rooms</h3>

        {rooms.length === 0 && (
          <p className="rf-room-empty">No rooms yet</p>
        )}

        {rooms.map((room) => (
          <div
            key={room._id}
            className="rf-room-item"
            onClick={() => navigate(`/main/chat/private/${room.roomId}`)}
          >
            <span className="rf-room-code">{room.roomId}</span>
            <span className="rf-room-owner">
              created by {room.createdBy || "user"}
            </span>
          </div>
        ))}

      </div> */}

    </div>
  );
}