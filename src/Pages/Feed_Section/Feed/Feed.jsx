
import AutoPlayVideo from "../../../Autoplay/AutoPlayVideo";
import "./Feed.css";
import { FaRegWindowClose } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../utils/api"

/* ===============================
   INITIAL POSTS
=================================*/

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

      setFeedPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="rf-feed-loading">Loading Posts...</div>;
  }

  /* ===============================
     LIKE
  =================================*/
  const handleLike = async (id) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );

    // await axios.post(`/api/posts/${id}/like`);
  };

  /* ===============================
     COMMENT
  =================================*/
  const handleComment = (id) => {
    setActivePost(id);

    // API READY
    // axios.get(`/api/posts/${id}/comments`)
    //   .then(res => setComments(prev => ({
    //       ...prev,
    //       [id]: res.data
    //   })));
  };

  const addComment = async () => {
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

    // API READY
    // await axios.post(`/api/posts/${activePost}/comments`, {
    //   text: newComment
    // });
  };

  /* ===============================
     SAVE POST
  =================================*/
  const handleSave = async (id) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, saved: !post.saved } : post,
      ),
    );

    // await axios.post(`/api/posts/${id}/save`);
  };

  return (
    <div className="rf-video-feed">
      {feedPosts.map((post) => (
        <div key={post.id} className="rf-video-card">
          {/* USER INFO */}
          <div className="rf-video-info">
            <div className="rf-post-left">
              <h4>{post.username}</h4>
              <p>{post.caption}</p>
            </div>

            <div className="rf-post-category">
              <p className="rf-category">{post.category}</p>
            </div>
          </div>

          {/* VIDEO */}
          <>
            {post.mediaType === "video" ? (
              <AutoPlayVideo src={post.media} />
            ) : (
              <img
                src={post.media}
                alt={post.caption}
                className="rf-feed-image"
              />
            )}
          </>

          {/* ACTIONS */}
          <div className="rf-video-actions">
            <div className="rf-actions-left">
              {/* LIKE */}
              <button
                className="rf-action-btn"
                onClick={() => handleLike(post.id)}
              >
                <i
                  className={`bi ${post.liked ? "bi-heart-fill" : "bi-heart"}`}
                ></i>
                <span>{post.likes}</span>
              </button>

              {/* COMMENT */}
              <button
                className="rf-action-btn"
                onClick={() => handleComment(post.id)}
              >
                <i className="bi bi-chat"></i>
                <span>{post.comments}</span>
              </button>

              {/* SAVE — NOW LEFT */}
              <button
                className="rf-action-btn"
                onClick={() => handleSave(post.id)}
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
