import { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css";
import { API_URL } from "../../../utils/api" 

export default function EditProfile() {
  const [preview, setPreview] = useState(null);
  const [selectedSoftwares, setSelectedSoftwares] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    bio: "",
    country: "",
  });

  const token = localStorage.getItem("token");

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Estonia",
    "Ethiopia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Greenland",
    "Guatemala",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Malaysia",
    "Maldives",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Morocco",
    "Myanmar",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Panama",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Saudi Arabia",
    "Serbia",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Somalia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Thailand",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const softwares = [
    "Adobe After Effects",
    "Adobe Premiere Pro",
    "DaVinci Resolve",
    "Final Cut Pro",
    "CapCut",
    "Filmora",
    "Vegas Pro",
    "HitFilm",
    "Lightworks",
    "Shotcut",
    "OpenShot",
    "Kdenlive",
    "Blender",
    "Avid Media Composer",
    "Pinnacle Studio",
    "Corel VideoStudio",
    "Magix Movie Edit Pro",
    "CyberLink PowerDirector",
    "Movavi Video Editor",
    "VSDC Video Editor",
    "Edius",
    "Apple iMovie",
    "Clipchamp",
    "InShot",
    "VN Video Editor",
    "LumaFusion",
    "Alight Motion",
    "Node Video",
    "VideoLeap",
    "KineMaster",
    "Splice",
    "ActionDirector",
    "Adobe Premiere Rush",
    "DaVinci Resolve Studio",
    "HitPaw Video Editor",
    "Animotica",
    "WeVideo",
    "Kapwing",
    "Descript",
    "Runway ML",
    "Topaz Video AI",
    "HandBrake",
    "FFmpeg",
  ];

  // 🔥 FETCH USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;

        setFormData({
          username: user.username || "",
          name: user.name || "",
          bio: user.bio || "",
          country: user.country || "",
        });

        setSelectedSoftwares(user.softwares || []);
        setPreview(user.avatar || null);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 SOFTWARE ADD
  const addSoftware = (software) => {
    if (!software || selectedSoftwares.includes(software)) return;
    setSelectedSoftwares((prev) => [...prev, software]);
  };

  const removeSoftware = (software) => {
    setSelectedSoftwares((prev) => prev.filter((item) => item !== software));
  };

  // 🔥 IMAGE PREVIEW
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // Later → upload to cloudinary
    }
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/api/user/update`,
        {
          ...formData,
          softwares: selectedSoftwares,
          avatar: preview, // temp (later replace with cloudinary URL)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Profile Updated");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <div className="rf-account-settings">
      <h3 className="rf-settings-title">Edit Profile</h3>

      {/* PROFILE PIC */}
      <div className="rf-profile-pic-section">
        <img
          src={preview || "https://i.pravatar.cc/150?img=32"}
          alt="profile"
          className="rf-profile-preview"
        />

        <label className="rf-upload-btn">
          <i className="bi bi-pen-fill"></i>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>

        <input
          className="rf-username-input"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
      </div>

      {/* FORM */}
      <form className="rf-settings-form" onSubmit={handleSubmit}>
        {/* NAME */}
        <div className="rf-form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>

        {/* BIO */}
        <div className="rf-form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write something about you..."
          />
        </div>

        {/* SOFTWARE */}
        <div className="rf-form-group">
          <label>Softwares</label>

          <div className="rf-selected-chips">
            {selectedSoftwares.map((software) => (
              <div key={software} className="rf-chip active">
                {software}
                <span
                  className="rf-chip-remove"
                  onClick={() => removeSoftware(software)}
                >
                  ×
                </span>
              </div>
            ))}
          </div>

          <select
            value=""
            onChange={(e) => addSoftware(e.target.value)}
            className="rf-software-select"
          >
            <option value="" disabled>
              Select Software
            </option>

            {softwares
              .filter((s) => !selectedSoftwares.includes(s))
              .map((software) => (
                <option key={software} value={software}>
                  {software}
                </option>
              ))}
          </select>
        </div>

        {/* COUNTRY */}
        <div className="rf-form-group">
          <label>Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* SUBMIT */}
        <button type="submit" className="rf-apply-btn">
          Apply Changes
        </button>
      </form>
    </div>
  );
}
