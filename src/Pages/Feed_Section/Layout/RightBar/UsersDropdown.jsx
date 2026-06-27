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
    <div className="rf-dropdown-users">

      <input
        type="text"
        placeholder="Search users..."
        className="rf-dropdown-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="rf-dropdown-list">

        {filteredUsers.slice(0, 20).map((user) => (
          <div
            key={user._id}
            className="rf-dropdown-user"
            onClick={() =>
              navigate(`/main/users/${user._id}`)
            }
          >
            <img
              src={user.avatar}
              alt=""
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

      </div>

    </div>
  );
}