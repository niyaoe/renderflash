import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AccountSettings.css";

export default function AccountSettings() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: "",
    privateAccount: false,
    emailNotifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form); // API ready
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // go to login page
  };

  return (
    <div className="rf-account-settings">
      {/* <h3 className="rf-settings-title">Account Settings</h3> */}

      <form className="rf-settings-form" onSubmit={handleSubmit}>
        {/* EMAIL */}
        {/* <div className="rf-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />
        </div> */}

        {/* PRIVACY */}
        <div className="rf-settings-toggle">
          <label>Private Account</label>
          <input
            type="checkbox"
            name="privateAccount"
            checked={form.privateAccount}
            onChange={handleChange}
          />
        </div>

        {/* NOTIFICATIONS */}
        <div className="rf-settings-toggle">
          <label>Email Notifications</label>
          <input
            type="checkbox"
            name="emailNotifications"
            checked={form.emailNotifications}
            onChange={handleChange}
          />
        </div>

        {/* CHANGE PASSWORD NAV */}
        <Link
          to="/main/settings/change-password"
          className="rf-settings-nav"
        >
          Change Password
          <i className="bi bi-chevron-right"></i>
        </Link>

        {/* APPLY BUTTON */}
        <button className="rf-apply-btn" type="submit">
          Save Changes
        </button>
        <button className="rf-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </form>
    </div>
  );
}
