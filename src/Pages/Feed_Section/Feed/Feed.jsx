import AutoPlayVideo from "../../../Autoplay/AutoPlayVideo";
import "./Feed.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../utils/api";

export default function Feed() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);

      const formattedPosts = res.data.map((post) => ({
        ...post,
        liked: post.likes?.includes(currentUser._id),
        saved: false,
      }));

      setFeedPosts(formattedPosts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${postId}/like`,
        {},
        config,
      );

      setFeedPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;

          return {
            ...post,
            liked: res.data.liked,
            likes: res.data.liked
              ? [...post.likes, currentUser._id]
              : post.likes.filter((id) => id !== currentUser._id),
          };
        }),
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleSave = (postId) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              saved: !post.saved,
            }
          : post,
      ),
    );
  };

  const handleComment = (post) => {
    setActivePost(post);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${activePost._id}/comment`,
        {
          text: newComment,
        },
        config,
      );

      setFeedPosts((prev) =>
        prev.map((post) =>
          post._id === activePost._id
            ? {
                ...post,
                comments: res.data,
              }
            : post,
        ),
      );

      setActivePost((prev) => ({
        ...prev,
        comments: res.data,
      }));

      setNewComment("");
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) {
    return (
      <div className="rf-feed-loading">
        <div className="rf-loader"></div>
        <p>Loading Posts...</p>
      </div>
    );
  }

  return (
    <div className="rf-video-feed">
      {feedPosts.map((post) => (
        <div key={post._id} className="rf-video-card">
          {/* HEADER */}
          <div className="rf-video-info">
            <div className="rf-post-user">
              <img
                src={post.avatar}
                alt={post.username}
                className="rf-post-avatar"
              />

              <div>
                <h4>{post.username}</h4>
              </div>
            </div>

            <div className="rf-post-category">
              <span className="rf-category">{post.category}</span>
            </div>
          </div>

          {/* MEDIA */}
          {post.mediaType === "video" ? (
            <AutoPlayVideo src={post.media} postId={post._id} />
          ) : (
            <img
              src={post.media}
              alt={post.caption}
              className="rf-feed-image"
            />
          )}

          {/* ACTION BAR */}
          <div className="rf-video-actions">
            <div className="rf-actions-left">
              <button
                className="rf-action-btn"
                onClick={() => handleLike(post._id)}
              >
                <i
                  className={`bi ${post.liked ? "bi-heart-fill" : "bi-heart"}`}
                ></i>

                <span>{post.likes?.length || 0}</span>
              </button>

              <button
                className="rf-action-btn"
                onClick={() => handleComment(post)}
              >
                <i className="bi bi-chat"></i>

                <span>{post.comments?.length || 0}</span>
              </button>

              <button
                className="rf-action-btn"
                onClick={() => handleSave(post._id)}
              >
                <i
                  className={`bi ${
                    post.saved ? "bi-bookmark-fill" : "bi-bookmark"
                  }`}
                ></i>
              </button>
              <button className="rf-action-btn">
                <i className="bi bi-eye"></i>
                <span>{post.views || 0}</span>
              </button>
            </div>
          </div>

          {/* CAPTION */}
          {post.caption && (
            <div className="rf-post-caption-wrap">
              <span className="rf-post-username">{post.username}</span>
              {post.caption}
            </div>
          )}
        </div>
      ))}

      {/* COMMENT MODAL */}

      {activePost && (
        <div className="rf-comment-overlay">
          <div className="rf-comment-box">
            <div className="rf-comment-header">
              <h4>Comments</h4>

              <i
                className="bi bi-x-lg rf-close-icon"
                onClick={() => setActivePost(null)}
              ></i>
            </div>

            <div className="rf-comment-list">
              {(activePost?.comments || []).map((c) => (
                <div key={c._id} className="rf-comment-item">
                  <b>{c.username}</b>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>

            <div className="rf-comment-input">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />

              <i
                className="bi bi-send-fill rf-comment-send"
                onClick={addComment}
              ></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
