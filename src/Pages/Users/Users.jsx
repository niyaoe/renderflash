import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api";
import "./RFUsers.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    fetchUsers(1, "");
  }, []);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers([]);
      setPage(1);
      setHasMore(true);

      fetchUsers(1, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- PAGINATION ---------------- */

  useEffect(() => {
    if (page === 1) return;

    fetchUsers(page, search);
  }, [page]);

  /* ---------------- SCROLL ---------------- */

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 250
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async (pageNumber = 1, searchText = "") => {
    if (loading || (!hasMore && pageNumber !== 1)) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/user/all?page=${pageNumber}&limit=20&search=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (pageNumber === 1) {
        setUsers(res.data.users);
      } else {
        setUsers((prev) => [...prev, ...res.data.users]);
      }

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  /* ---------------- LOADER ---------------- */

  if (initialLoading) {
    return (
      <div className="rf-feed-loading">
        <div className="rf-loader"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="rf-users-page">
      <div className="rf-users-header">
        <input
          type="text"
          placeholder="Search users..."
          className="rf-users-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rf-users-grid">
        {users.map((user) => (
          <div
            key={user._id}
            className="rf-user-card"
            onClick={() => navigate(`/main/users/${user._id}`)}
          >
            <img
              src={user.avatar}
              alt={user.username}
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

            <i className="bi bi-chevron-right rf-user-arrow"></i>
          </div>
        ))}
      </div>

      {loading && (
        <div className="rf-feed-loading">
          <div className="rf-loader"></div>
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <div className="rf-feed-end">
          No more users
        </div>
      )}
    </div>
  );
}