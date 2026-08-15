import { useState } from "react";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="rf-account-settings">
      <h3 className="rf-settings-title">Change Password (DEMO)</h3>

      <form className="rf-settings-form">
        <div className="rf-form-group">
          <label>Current Password</label>
          <input type="password" />
        </div>

        <div className="rf-form-group">
          <label>New Password</label>
          <input type="password" />
        </div>

        <div className="rf-form-group">
          <label>Confirm Password</label>
          <input type="password" />
        </div>

        <button className="rf-apply-btn">Update Password</button>
      </form>
    </div>
  );
}