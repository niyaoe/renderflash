import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../utils/api";
import "./UsersDropdown.css";

export default function UsersDropdown() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async (searchText = "") => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/user/all?page=1&limit=20&search=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="rf-dropdown-users">
      <input
        type="text"
        placeholder="Search users..."
        className="rf-dropdown-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="rf-dropdown-list">
        {users.map((user) => (
          <div
            key={user._id}
            className="rf-dropdown-user"
            onClick={() => navigate(`/main/users/${user._id}`)}
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="rf-dropdown-avatar"
            />

            <div>
              <div className="rf-dropdown-name">
                {user.name || user.username}
              </div>

              <div className="rf-dropdown-username">
                @{user.username}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="rf-dropdown-empty">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}