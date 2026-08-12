import React, { useEffect, useState, useCallback } from "react";
import "./PublicProfile.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../../utils/api";

const PublicProfile = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const [activeTab, setActiveTab] = useState("posts");

  // Posts
  const [posts, setPosts] = useState([]);
  const [totalEdits, setTotalEdits] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Liked posts
  const [likedPosts, setLikedPosts] = useState([]);
  const [loadingLiked, setLoadingLiked] = useState(false);

  const token = localStorage.getItem("token");

  /* =========================
     FETCH PROFILE
  ========================== */

  const fetchProfile = async () => {
    try {
      const profileRes = await axios.get(
        `${API_URL}/api/user/profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(profileRes.data);

      const meRes = await axios.get(`${API_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFollowing(meRes.data.following?.includes(id));
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
     FETCH POSTS
  ========================== */

  const fetchPosts = useCallback(
    async (pageNumber = 1) => {
      if (loadingPosts || (!hasMore && pageNumber !== 1)) {
        return;
      }

      try {
        setLoadingPosts(true);

        const res = await axios.get(
          `${API_URL}/api/posts/user/${id}?page=${pageNumber}&limit=12`
        );

        const newPosts = res.data.posts || [];

        if (pageNumber === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setTotalEdits(res.data.totalEdits || 0);
        setHasMore(res.data.hasMore);

      } catch (err) {
        console.log(err);
      } finally {
        setLoadingPosts(false);
      }
    },
    [id, loadingPosts, hasMore]
  );

  /* =========================
     FETCH LIKED POSTS
  ========================== */

  const fetchLikedPosts = async () => {
    try {
      setLoadingLiked(true);

      const res = await axios.get(
        `${API_URL}/api/posts/liked/${id}`
      );

      setLikedPosts(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLiked(false);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================== */

  useEffect(() => {
    fetchProfile();

    // Reset posts when profile changes
    setPosts([]);
    setPage(1);
    setHasMore(true);

    fetchPosts(1);
    fetchLikedPosts();
  }, [id]);

  /* =========================
     LOAD MORE
  ========================== */

  const loadMorePosts = useCallback(() => {
    if (loadingPosts || !hasMore) {
      return;
    }

    setPage((prevPage) => {
      const nextPage = prevPage + 1;

      fetchPosts(nextPage);

      return nextPage;
    });
  }, [loadingPosts, hasMore, fetchPosts]);

  /* =========================
     INFINITE SCROLL
  ========================== */

  useEffect(() => {
    if (activeTab !== "posts") {
      return;
    }

    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + window.scrollY;

      const pageHeight =
        document.documentElement.scrollHeight;

      // Start loading before reaching absolute bottom
      if (scrollPosition >= pageHeight - 500) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, loadMorePosts]);

  /* =========================
     FOLLOW
  ========================== */

  const handleFollow = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFollowing(res.data.following);

      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
     LOADING PROFILE
  ========================== */

  if (!user) {
    return (
      <div className="rf-feed-loading">
        <div className="rf-loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const displayedPosts =
    activeTab === "posts" ? posts : likedPosts;

  return (
    <div>

      {/* =========================
          PROFILE
      ========================== */}

      <div className="public-profile-section">

        <div className="public-profile-card">

          <div className="public-outer-profile">

            <div className="public-profile-top">

              <img
                src={user.avatar}
                alt="profile"
                className="public-profile-image"
              />

              <div className="public-profile-info">

                <h2 className="public-profile-username">

                  {user.username}

                  {user.country && (
                    <span className="public-country-p">
                      {user.country}
                    </span>
                  )}

                </h2>

                <div className="public-profile-stats">

                  {/* EDITS */}

                  <div className="public-stat">

                    <span className="public-stat-number">
                      {totalEdits}
                    </span>

                    <span className="public-stat-label">
                      Edits
                    </span>

                  </div>

                  {/* FANS */}

                  <div className="public-stat">

                    <span className="public-stat-number">
                      {user.followers?.length || 0}
                    </span>

                    <span className="public-stat-label">
                      Fans
                    </span>

                  </div>

                  {/* FOLLOWING */}

                  <div className="public-stat">

                    <span className="public-stat-number">
                      {user.following?.length || 0}
                    </span>

                    <span className="public-stat-label">
                      Following
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* FOLLOW */}

            <div className="public-profile-follow">

              <button
                className={`follow-btn ${
                  following ? "following" : ""
                }`}
                onClick={handleFollow}
              >
                {following ? "Following" : "Follow"}
              </button>

            </div>

          </div>

          {/* BIO */}

          <div className="public-profile-bio">

            <p>{user.name}</p>

            <p className="public-bio-p">
              {user.bio}
            </p>

            {user.softwares?.map((soft, index) => (
              <p
                className="public-software-p"
                key={index}
              >
                {soft}
              </p>
            ))}

          </div>

        </div>

      </div>

      {/* =========================
          TABS
      ========================== */}

      <div className="public-profile-tabs">

        <button
          className={
            activeTab === "posts"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("posts")}
        >
          Edits
        </button>

        <button
          className={
            activeTab === "liked"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("liked")}
        >
          Liked
        </button>

      </div>

      {/* =========================
          POSTS GRID
      ========================== */}

      <div className="public-profile-grid">

        {displayedPosts.map((post) => (

          <div
            key={post._id}
            className="public-profile-item"
          >

            {post.mediaType === "image" ? (
              <img
                src={post.media}
                alt=""
                loading="lazy"
              />
            ) : (
              <video
                src={post.media}
                muted
                preload="metadata"
              />
            )}

            <div className="public-profile-overlay">

              <span>
                <i className="bi bi-heart-fill"></i>
                {post.likes?.length || 0}
              </span>

              <span>
                <i className="bi bi-chat-fill"></i>
                {post.comments?.length || 0}
              </span>

            </div>

          </div>

        ))}

      </div>

      {/* =========================
          LOADING MORE
      ========================== */}

      {activeTab === "posts" && loadingPosts && (
        <div className="public-profile-loading-more">
          <div className="public-profile-spinner"></div>
          <span>Loading more edits...</span>
        </div>
      )}

      {/* =========================
          END
      ========================== */}

      {activeTab === "posts" &&
        !hasMore &&
        posts.length > 0 && (
          <div className="public-profile-end">
            <span>No more edits</span>
          </div>
        )}

      {/* =========================
          EMPTY
      ========================== */}

      {activeTab === "posts" &&
        !loadingPosts &&
        posts.length === 0 && (
          <div className="public-profile-empty">
            No edits yet
          </div>
        )}

      {activeTab === "liked" &&
        !loadingLiked &&
        likedPosts.length === 0 && (
          <div className="public-profile-empty">
            No liked posts
          </div>
        )}

    </div>
  );
};

export default PublicProfile;