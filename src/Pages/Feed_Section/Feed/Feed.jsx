import AutoPlayVideo from "../../../Autoplay/AutoPlayVideo";
import "./Feed.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../utils/api";

export default function Feed() {
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
        liked: false,
        saved: false,
      }));

      setFeedPosts(formattedPosts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              liked: !post.liked,
            }
          : post,
      ),
    );
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

  const handleComment = (postId) => {
    setActivePost(postId);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      user: "@you",
      text: newComment,
    };

    setComments((prev) => ({
      ...prev,
      [activePost]: [...(prev[activePost] || []), commentObj],
    }));

    setNewComment("");
  };

  if (loading) {
    return <div className="rf-feed-loading">Loading Posts...</div>;
  }

  return (
    <div className="rf-video-feed">
      {feedPosts.map((post) => (
        <div key={post._id} className="rf-video-card">
          {/* USER INFO */}
          <div className="rf-video-info">
            <div className="rf-post-user">
              <img
                src={post.avatar}
                alt={post.username}
                className="rf-post-avatar"
              />

              <div>
                <h4>u/{post.username}</h4>
                <div className="rf-post-caption">{post.caption}</div>
              </div>
            </div>

            <div className="rf-post-category">
              <span className="rf-category">{post.category}</span>
            </div>
          </div>

          {/* MEDIA */}
          {post.mediaType === "video" ? (
            <AutoPlayVideo src={post.media} />
          ) : (
            <img
              src={post.media}
              alt={post.caption}
              className="rf-feed-image"
            />
          )}

          {/* ACTIONS */}
          <div className="rf-video-actions">
            <div className="rf-actions-left">
              <button
                className="rf-action-btn"
                onClick={() => handleLike(post._id)}
              >
                <i
                  className={`bi ${post.liked ? "bi-heart-fill" : "bi-heart"}`}
                ></i>

                <span>{(post.likes?.length || 0) + (post.liked ? 1 : 0)}</span>
              </button>

              <button
                className="rf-action-btn"
                onClick={() => handleComment(post._id)}
              >
                <i className="bi bi-chat"></i>

                <span>{post.commentsCount || 0}</span>
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
            </div>
          </div>
        </div>
      ))}

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
              {(comments[activePost] || []).map((c) => (
                <div key={c.id} className="rf-comment-item">
                  <b>{c.user}</b>
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
