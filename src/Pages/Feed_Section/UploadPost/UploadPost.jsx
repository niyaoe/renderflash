import { useState } from "react";
import axios from "axios";
import "./RFUploadPost.css";
import { API_URL } from "../../../utils/api";

export default function UploadPost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

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
      formData.append("user", currentUser.name);
      formData.append("avatar", currentUser.avatar);

      await axios.post(
        `${API_URL}/api/posts/create`,
        formData
      );

      setCaption("");
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

        <h2 className="rf-upload-title">
          Create Post
        </h2>

        {/* PREVIEW */}
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