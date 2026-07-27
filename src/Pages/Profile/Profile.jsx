import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";

import axios from "axios";
import { API_URL } from "../../utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");

  const [posts, setPosts] = useState([]);

  const [likedPosts, setLikedPosts] = useState([]);

  const [totalEdits, setTotalEdits] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  const fetchPosts = async (pageNumber = page) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/posts/user/${user._id}?page=${pageNumber}&limit=12`,
      );

      if (pageNumber === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => {
          const map = new Map();

          [...prev, ...res.data.posts].forEach((post) => {
            map.set(post._id, post);
          });

          return [...map.values()];
        });
      }

      setHasMore(res.data.hasMore);
      setTotalEdits(res.data.totalEdits);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts/liked/${user._id}`);

      setLikedPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore || activeTab !== "posts") return;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 250
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, activeTab]);

  useEffect(() => {
    if (user) {
      fetchPosts(page);
    }
  }, [user, page]);

  useEffect(() => {
    if (user) {
      fetchLikedPosts();
    }
  }, [user]);

  // console.log("posts :",posts);

  if (!user)
    return (
      <div className="rf-feed-loading">
        <div className="rf-loader"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div>
      <div className="profile-section">
        <div className="profile-card">
          {/* Top Section */}
          <div className="outer-profile">
            <div className="profile-top">
              <img src={user.avatar} alt="profile" className="profile-image" />

              <div className="profile-info">
                <h2 className="profile-username">
                  {user.username}
                  {user.country && (
                    <span className="country-p">{user.country}</span>
                  )}
                </h2>

                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{totalEdits}</span>
                    <span className="stat-label">Edits</span>
                  </div>

                  <div className="stat">
                    <span className="stat-number">
                      {user.followers?.length || 0}
                    </span>
                    <span className="stat-label">Fans</span>
                  </div>

                  <div className="stat">
                    <span className="stat-number">
                      {user.following?.length || 0}
                    </span>
                    <span className="stat-label">Following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right icons */}
            <div className="profile-right">
              <Link to="/main/settings" className="profile-settings-link">
                <i className="bi bi-gear-fill"></i>
              </Link>

              <Link
                to="/main/settings/edit-profile"
                className="profile-settings-link"
              >
                <i className="bi bi-pencil-square"></i>
              </Link>
            </div>
          </div>

          {/* Bio Section */}
          <div className="profile-bio">
            <p>{user.name}</p>
            <p className="bio-p">{user.bio}</p>

            {/* softwares */}
            {user.softwares?.map((soft, index) => (
              <p className="software-p" key={index}>
                {soft}
              </p>
            ))}

            {/* country */}
          </div>
        </div>
      </div>
      <div className="rf-profile-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          {/* <i className="bi bi-grid-3x3-gap-fill"></i> */}
          Edits
        </button>

        <button
          className={activeTab === "liked" ? "active" : ""}
          onClick={() => setActiveTab("liked")}
        >
          {/* <i className="bi bi-heart-fill"></i> */}
          Liked
        </button>
      </div>

      <div className="rf-profile-grid">
        {(activeTab === "posts" ? posts : likedPosts).map((post) => (
          <div key={post._id} className="rf-profile-item">
            {post.mediaType === "image" ? (
              <img src={post.media} alt="" />
            ) : (
              <video src={post.media} muted />
            )}

            <div className="rf-profile-overlay">
              <span>
                <i className="bi bi-heart-fill"></i>
                {post.likes.length}
              </span>

              <span>
                <i className="bi bi-chat-fill"></i>
                {post.comments.length}
              </span>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="rf-feed-loading">
          <div className="rf-loader"></div>
        </div>
      )}

      {!hasMore && activeTab === "posts" && posts.length > 0 && (
        <div className="rf-feed-end">No more edits</div>
      )}
    </div>
  );
};

export default Profile;
