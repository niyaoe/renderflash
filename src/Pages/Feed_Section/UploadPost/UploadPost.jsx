import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./RFUploadPost.css";
import { API_URL } from "../../../utils/api";
import { toast } from "react-toastify";

export default function UploadPost() {
  const [caption, setCaption] = useState("");

  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");

  // Selected category ID
  const [category, setCategory] = useState("");

  // Category search
  const [categorySearch, setCategorySearch] = useState("");

  // Categories from MongoDB
  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  /* =========================
     FETCH CATEGORIES
  ========================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const res = await axios.get(
          `${API_URL}/api/categories`
        );

        setCategories(res.data || []);
      } catch (err) {
        console.log("Category error:", err);

        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* =========================
     FILTER CATEGORIES
  ========================== */

  const filteredCategories = useMemo(() => {
    const search = categorySearch.toLowerCase().trim();

    if (!search) {
      return categories;
    }

    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search)
    );
  }, [categories, categorySearch]);

  /* =========================
     HANDLE FILE
  ========================== */

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Release previous preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setMedia(file);

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  /* =========================
     REMOVE FILE
  ========================== */

  const handleRemoveMedia = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setMedia(null);
    setPreview("");
  };

  /* =========================
     SELECT CATEGORY
  ========================== */

  const handleCategorySelect = (categoryId) => {
    if (loading) return;

    setCategory(categoryId);
  };

  /* =========================
     UPLOAD POST
  ========================== */

  const handleUpload = async () => {
    if (!media) {
      toast.error("Please select an image or video");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!currentUser?._id) {
      toast.error("Please login again");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("media", media);
      formData.append("caption", caption);

      formData.append("user", currentUser._id);
      formData.append("username", currentUser.username);
      formData.append("avatar", currentUser.avatar);

      // MongoDB Category ID
      formData.append("category", category);

      await axios.post(
        `${API_URL}/api/posts/create`,
        formData
      );

      toast.success("Post uploaded successfully");

      // Reset caption
      setCaption("");

      // Reset category
      setCategory("");
      setCategorySearch("");

      // Remove media
      handleRemoveMedia();

    } catch (err) {
      console.log("Upload error:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to upload post"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CLEANUP PREVIEW
  ========================== */

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* =========================
     SELECTED CATEGORY OBJECT
  ========================== */

  const selectedCategory = categories.find(
    (cat) => cat._id === category
  );

  return (
    <main className="rf-upload-page">

      <div className="rf-upload-container">

        {/* =========================
            HEADER
        ========================== */}

        

        {/* =========================
            CONTENT
        ========================== */}

        <div className="rf-upload-content">

          {/* =========================
              MEDIA PREVIEW
          ========================== */}

          <section className="rf-upload-preview-section">

            <div className="rf-upload-section-header">

              <h2>
                Preview
              </h2>

              {media && (
                <button
                  type="button"
                  className="rf-upload-remove-btn"
                  onClick={handleRemoveMedia}
                  disabled={loading}
                >
                  <i className="bi bi-trash3"></i>
                  Remove
                </button>
              )}

            </div>

            {/* PREVIEW BOX */}

            <div
              className={`rf-upload-preview-box ${
                media ? "has-media" : ""
              }`}
            >

              {/* EMPTY */}

              {!media && (
                <label className="rf-upload-empty">

                  <div className="rf-upload-empty-icon">
                    <i className="bi bi-cloud-arrow-up"></i>
                  </div>

                  <h3>
                    Select an image or video
                  </h3>

                  <p>
                    Your original aspect ratio
                    will be preserved.
                  </p>

                  <span className="rf-upload-select-btn">

                    <i className="bi bi-image"></i>

                    Select Media

                  </span>

                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={handleFile}
                    disabled={loading}
                  />

                </label>
              )}

              {/* MEDIA */}

              {media && (
                <>
                  {media.type.startsWith("video") ? (
                    <video
                      src={preview}
                      controls
                      className="rf-upload-preview-media"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Selected media"
                      className="rf-upload-preview-media"
                    />
                  )}
                </>
              )}

            </div>

            {/* CHANGE MEDIA */}

            {media && (
              <label className="rf-upload-change-btn">

                <i className="bi bi-arrow-repeat"></i>

                Change Media

                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={handleFile}
                  disabled={loading}
                />

              </label>
            )}

          </section>

          {/* =========================
              POST DETAILS
          ========================== */}

          <section className="rf-upload-details">

            {/* =========================
                CAPTION
            ========================== */}

            <div className="rf-upload-form-group">

              <label className="rf-upload-label">
                Caption
              </label>

              <textarea
                className="rf-upload-caption"
                placeholder="Write something about your edit..."
                value={caption}
                onChange={(e) =>
                  setCaption(e.target.value)
                }
                maxLength={500}
                disabled={loading}
              />

              <div className="rf-upload-character-count">
                {caption.length}/500
              </div>

            </div>

            {/* =========================
                CATEGORY
            ========================== */}

            <div className="rf-upload-form-group">

              <label className="rf-upload-label">
                Category
              </label>

              {/* SEARCH */}

              <div className="rf-upload-category-search">

                <i className="bi bi-search"></i>

                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) =>
                    setCategorySearch(e.target.value)
                  }
                  disabled={
                    loadingCategories ||
                    loading
                  }
                />

                {categorySearch && (
                  <button
                    type="button"
                    className="rf-upload-category-clear"
                    onClick={() =>
                      setCategorySearch("")
                    }
                    disabled={loading}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}

              </div>

              {/* CATEGORY LIST */}

              <div className="rf-upload-category-list">

                {/* LOADING */}

                {loadingCategories ? (
                  <div className="rf-upload-category-loading">

                    <span className="rf-upload-small-spinner"></span>

                    Loading categories...

                  </div>

                ) : filteredCategories.length === 0 ? (

                  /* EMPTY */

                  <div className="rf-upload-no-category">

                    <i className="bi bi-search"></i>

                    <span>
                      No categories found
                    </span>

                  </div>

                ) : (

                  /* CATEGORIES */

                  filteredCategories.map((cat) => (

                    <button
                      type="button"
                      key={cat._id}
                      className={`rf-upload-category-item ${
                        category === cat._id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategorySelect(cat._id)
                      }
                      disabled={loading}
                    >

                      <span>
                        {cat.name}
                      </span>

                      {category === cat._id && (
                        <i className="bi bi-check-lg"></i>
                      )}

                    </button>

                  ))

                )}

              </div>

              {/* SELECTED CATEGORY */}

              {selectedCategory && (
                <div className="rf-upload-selected-category">

                  <span>
                    Selected:
                  </span>

                  <strong>
                    {selectedCategory.name}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      setCategory("")
                    }
                    disabled={loading}
                    aria-label="Remove category"
                  >
                    <i className="bi bi-x"></i>
                  </button>

                </div>
              )}

            </div>

            {/* =========================
                UPLOAD BUTTON
            ========================== */}

            <button
              type="button"
              className="rf-upload-submit"
              onClick={handleUpload}
              disabled={
                loading ||
                loadingCategories ||
                !media ||
                !category
              }
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

          </section>

        </div>

      </div>

    </main>
  );
}