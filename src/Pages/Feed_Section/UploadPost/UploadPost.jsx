import { useState } from "react";
import axios from "axios";
import "./RFUploadPost.css";
import { API_URL } from "../../../utils/api";

export default function UploadPost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  console.log(currentUser);

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

      alert("Post uploaded 🚀");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rf-upload-container">
      <div className="rf-upload-card">
        <h2 className="rf-upload-title">Upload Edit</h2>

        {/* PREVIEW */}
        {preview && (
          <div className="rf-upload-preview-wrapper">
            {media?.type.startsWith("video") ? (
              <video src={preview} controls className="rf-upload-preview" />
            ) : (
              <img src={preview} alt="preview" className="rf-upload-preview" />
            )}
          </div>
        )}

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

        {/* CAPTION */}
        <textarea
          className="rf-upload-caption"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* FILE INPUT */}
        <label className="rf-upload-file-btn">
          Select Media
          <input
            type="file"
            hidden
            accept="image/*,video/*"
            onChange={handleFile}
          />
        </label>

        {/* SUBMIT */}
        <button
          className="rf-upload-submit-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Post"}
        </button>
      </div>
    </div>
  );
}
