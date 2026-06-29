import { useState } from "react";
import axios from "axios";
import "./RFUploadPost.css";
import { API_URL } from "../../../utils/api";
import { toast } from "react-toastify";

export default function UploadPost({ onClose }) {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  // console.log(currentUser);

  /* =========================
     HANDLE FILE
  ========================== */
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     UPLOAD POST
  ========================== */
  const handleUpload = async () => {
    if (!media) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("media", media);
      formData.append("caption", caption);

      formData.append("user", currentUser._id);
      formData.append("username", currentUser.username);
      formData.append("avatar", currentUser.avatar);

      formData.append("category", category);

      await axios.post(`${API_URL}/api/posts/create`, formData);

      setCaption("");
      setCategory("");
      setMedia(null);
      setPreview("");

      
      toast.success("Post uploaded");
      onClose?.();
    } catch (err) {
      console.log(err);
      toast.error("uploaded failed");
      
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="rf-upload-modal-overlay" onClick={onClose}>
    <div
      className="rf-upload-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="rf-upload-modal-header">
        <h2 className="rf-upload-title">Create Post</h2>

        <button
          className="rf-upload-close"
          onClick={onClose}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Body */}
      <div className="rf-upload-modal-body">
        {/* Preview */}
        {preview && (
          <div className="rf-upload-preview-wrapper">
            {media?.type.startsWith("video") ? (
              <video
                src={preview}
                controls
                className="rf-upload-preview"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="rf-upload-preview"
              />
            )}
          </div>
        )}

        {/* Category */}
        <select
          className="rf-upload-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>

          <option value="Video Editing">Video Editing</option>
          <option value="Motion Graphics">Motion Graphics</option>
          <option value="VFX">VFX</option>
          <option value="Photography">Photography</option>
          <option value="Color Grading">Color Grading</option>
          <option value="Gaming Edit">Gaming Edit</option>
          <option value="Cinematic">Cinematic</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Anime Edit">Anime Edit</option>
        </select>

        {/* Caption */}
        <textarea
          className="rf-upload-caption"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* File */}
        <label className="rf-upload-file-btn">
          <i className="bi bi-image"></i>
          Select Media

          <input
            type="file"
            hidden
            accept="image/*,video/*"
            onChange={handleFile}
          />
        </label>
      </div>

      {/* Footer */}
      <div className="rf-upload-modal-footer">
        <button
          className="rf-upload-submit-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="rf-upload-spinner"></span>
              Uploading...
            </>
          ) : (
            <>
              <i className="bi bi-cloud-upload"></i>
              Upload Post
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);
}
