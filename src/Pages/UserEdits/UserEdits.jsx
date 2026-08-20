import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import AutoPlayVideo from "../../Autoplay/AutoPlayVideo";
import { API_URL } from "../../utils/api";

import "./UserEdits.css";

export default function UserEdits() {
  const { id, postId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* =========================
     USER
  ========================== */

  const [user, setUser] = useState(null);

  /* =========================
     POSTS
  ========================== */

  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /* =========================
     COMMENTS
  ========================== */

  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState("");

  /* =========================
     FETCH USER
  ========================== */

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/user/profile/${id}`,
        config
      );

      setUser(res.data);
    } catch (err) {
      console.log("User error:", err);
    }
  };

  /* =========================
     FETCH POSTS
  ========================== */

  const fetchPosts = useCallback(
    async (pageNumber) => {
      if (loading || !hasMore) return;

      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/posts/user/${id}?page=${pageNumber}&limit=10`
        );

        const formattedPosts = (res.data.posts || []).map((post) => ({
          ...post,

          liked: post.likes?.some(
            (userId) =>
              userId.toString() === currentUser?._id?.toString()
          ),

          saved: false,
        }));

        setPosts((prev) => {
          const map = new Map();

          [...prev, ...formattedPosts].forEach((post) => {
            map.set(post._id, post);
          });

          return [...map.values()];
        });

        setHasMore(res.data.hasMore);
      } catch (err) {
        console.log("User edits error:", err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [id, loading, hasMore, currentUser?._id]
  );

  /* =========================
     INITIAL LOAD
  ========================== */

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);

    fetchUser();
  }, [id]);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  /* =========================
     SCROLL PAGINATION
  ========================== */

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  /* =========================
     LIKE
  ========================== */

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${postId}/like`,
        {},
        config
      );

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;

          return {
            ...post,

            liked: res.data.liked,

            likes: res.data.liked
              ? [...(post.likes || []), currentUser._id]
              : (post.likes || []).filter(
                  (userId) =>
                    userId.toString() !==
                    currentUser._id.toString()
                ),
          };
        })
      );

      setActivePost((prev) => {
        if (!prev || prev._id !== postId) return prev;

        return {
          ...prev,
          liked: res.data.liked,
        };
      });
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  /* =========================
     SAVE
  ========================== */

  const handleSave = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              saved: !post.saved,
            }
          : post
      )
    );
  };

  /* =========================
     COMMENT OPEN
  ========================== */

  const handleComment = (post) => {
    setActivePost(post);
    setNewComment("");
  };

  /* =========================
     ADD COMMENT
  ========================== */

  const addComment = async () => {
    if (!newComment.trim() || !activePost) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${activePost._id}/comment`,
        {
          text: newComment,
        },
        config
      );

      setPosts((prev) =>
        prev.map((post) =>
          post._id === activePost._id
            ? {
                ...post,
                comments: res.data,
              }
            : post
        )
      );

      setActivePost((prev) => ({
        ...prev,
        comments: res.data,
      }));

      setNewComment("");
    } catch (err) {
      console.log("Comment error:", err);
    }
  };

  /* =========================
     CLOSE COMMENTS
  ========================== */

  const closeComments = () => {
    setActivePost(null);
    setNewComment("");
  };

  /* =========================
     PROFILE
  ========================== */

  const openProfile = () => {
    navigate(`/main/users/${id}`);
  };

  /* =========================
     LOADING
  ========================== */

  if (initialLoading) {
    return (
      <div className="rf-user-edits-loading">
        <div className="rf-user-edits-loader"></div>
        <p>Loading Edits...</p>
      </div>
    );
  }

  return (
    <div className="rf-user-edits-page">

      {/* =========================
          HEADER
      ========================== */}

      <div className="rf-user-edits-header">

        <button
          className="rf-user-edits-back"
          onClick={openProfile}
        >
          <i className="bi bi-arrow-left"></i>
        </button>

        {user && (
          <div
            className="rf-user-edits-profile"
            onClick={openProfile}
          >
            <img
              src={user.avatar}
              alt={user.username}
            />

            <div>
              <h3>{user.username}</h3>
              {/* <span>Edits</span> */}
            </div>
          </div>
        )}

      </div>

      {/* =========================
          FEED
      ========================== */}

      <div className="rf-user-edits-feed">

        {posts.map((post) => (

          <div
            key={post._id}
            className={`rf-user-edits-card ${
              post._id === postId
                ? "rf-selected-edit"
                : ""
            }`}
          >

            {/* =========================
                POST HEADER
            ========================= */}

            <div className="rf-user-edits-info">

              <div
                className="rf-user-edits-user"
                onClick={openProfile}
                style={{ cursor: "pointer" }}
              >

                <img
                  src={post.avatar}
                  alt={post.username}
                  className="rf-user-edits-avatar"
                />

                <h4 className="rf-user-edits-username">
                  {post.username}
                </h4>

              </div>

              {/* CATEGORY */}

              <span className="rf-user-edits-category">
                {typeof post.category === "object"
                  ? post.category?.name
                  : post.category}
              </span>

            </div>

            {/* =========================
                MEDIA
            ========================== */}

            <div className="rf-user-edits-media">

              {post.mediaType === "video" ? (

                <AutoPlayVideo
                  src={post.media}
                  postId={post._id}
                />

              ) : (

                <img
                  src={post.media}
                  alt={post.caption}
                  className="rf-user-edits-image"
                />

              )}

            </div>

            {/* =========================
                ACTION BAR
            ========================== */}

            <div className="rf-user-edits-actions">

              <div className="rf-user-edits-actions-left">

                {/* LIKE */}

                <button
                  className={`rf-user-edits-action-btn ${
                    post.liked ? "liked" : ""
                  }`}
                  onClick={() => handleLike(post._id)}
                >

                  <i
                    className={`bi ${
                      post.liked
                        ? "bi-heart-fill"
                        : "bi-heart"
                    }`}
                  ></i>

                  <span>
                    {post.likes?.length || 0}
                  </span>

                </button>

                {/* COMMENT */}

                <button
                  className="rf-user-edits-action-btn"
                  onClick={() => handleComment(post)}
                >

                  <i className="bi bi-chat"></i>

                  <span>
                    {post.comments?.length || 0}
                  </span>

                </button>

                {/* SAVE */}

                <button
                  className="rf-user-edits-action-btn"
                  onClick={() => handleSave(post._id)}
                >

                  <i
                    className={`bi ${
                      post.saved
                        ? "bi-bookmark-fill"
                        : "bi-bookmark"
                    }`}
                  ></i>

                </button>

                {/* VIEWS */}

                <button
                  className="rf-user-edits-action-btn"
                  type="button"
                >

                  <i className="bi bi-eye"></i>

                  <span>
                    {post.views || 0}
                  </span>

                </button>

              </div>

            </div>

            {/* =========================
                CAPTION
            ========================== */}

            {post.caption && (

              <div className="rf-user-edits-caption">

                <span className="rf-user-edits-caption-username">
                  {post.username}
                </span>

                {post.caption}

              </div>

            )}

          </div>

        ))}

      </div>

      {/* =========================
          LOADING MORE
      ========================== */}

      {loading && (
        <div className="rf-user-edits-loading-more">
          <div className="rf-user-edits-loader"></div>
          <span>Loading more edits...</span>
        </div>
      )}

      {/* =========================
          END
      ========================== */}

      {!hasMore && posts.length > 0 && (
        <div className="rf-user-edits-end">
          🎉 You're all caught up.
        </div>
      )}

      {/* =========================
          EMPTY
      ========================== */}

      {!loading && posts.length === 0 && (
        <div className="rf-user-edits-empty">
          No edits found.
        </div>
      )}

      {/* =========================
          COMMENT MODAL
      ========================== */}

      {activePost && (

        <div
          className="rf-user-edits-comment-overlay"
          onClick={closeComments}
        >

          <div
            className="rf-user-edits-comment-box"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}

            <div className="rf-user-edits-comment-header">

              <h4>Comments</h4>

              <i
                className="bi bi-x-lg rf-user-edits-close-icon"
                onClick={closeComments}
              ></i>

            </div>

            {/* COMMENT LIST */}

            <div className="rf-user-edits-comment-list">

              {(activePost.comments || []).length === 0 ? (

                <div
                  style={{
                    textAlign: "center",
                    color: "#777",
                    padding: "30px",
                  }}
                >
                  No comments yet.
                </div>

              ) : (

                (activePost.comments || []).map((comment) => (

                  <div
                    key={comment._id}
                    className="rf-user-edits-comment-item"
                  >

                    <b>{comment.username}</b>

                    <p>
                      {comment.text}
                    </p>

                  </div>

                ))

              )}

            </div>

            {/* INPUT */}

            <div className="rf-user-edits-comment-input">

              <input
                value={newComment}
                onChange={(e) =>
                  setNewComment(e.target.value)
                }
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addComment();
                  }
                }}
              />

              <i
                className="bi bi-send-fill rf-user-edits-comment-send"
                onClick={addComment}
              ></i>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}