import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api";
import "./RFUsers.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/user/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.username
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <div className="rf-users-page">

      <div className="rf-users-header">

        <h2 className="rf-users-title">
          Discover Users
        </h2>

        <input
          type="text"
          placeholder="Search users..."
          className="rf-users-search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="rf-users-grid">

        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="rf-user-card"
            onClick={() =>
              navigate(`/main/users/${user._id}`)
            }
          >
            <img
              src={user.avatar}
              alt=""
              className="rf-user-avatar"
            />

            <div className="rf-user-info">

              <h4 className="rf-user-name">
                {user.name || user.username}
              </h4>

              <p className="rf-user-username">
                @{user.username}
              </p>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}