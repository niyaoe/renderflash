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

  const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/api/posts/user/${user._id}`);

    setPosts(res.data);
  };

  const fetchLikedPosts = async () => {
    const res = await axios.get(`${API_URL}/api/posts/liked/${user._id}`);

    setLikedPosts(res.data);
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchLikedPosts();
    }
  }, [user]);

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
                    <span className="stat-number">5</span>
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
          Posts
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
    </div>
  );
};

export default Profile;
