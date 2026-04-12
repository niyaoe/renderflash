import React, { useState } from "react";
import "./RenderFlashLogin.css";
import { Link, useNavigate } from "react-router-dom";
import TargetCursor from "../../Blits/TargetCursor";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { toast, Bounce } from "react-toastify";

const RenderFlashLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // store token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.user.username,
          avatar: res.data.user.avatar,
        }),
      );
      toast.success("Login successful");
      // redirect after login
      navigate("/main/profile");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="rf-login-wrapper">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      <div className="rf-login-container">
        <div className="rf-login-card">
          <Link className="loginPage-title" to="/">
            <h2 className="rf-login-logo cursor-target">renderFlash</h2>
          </Link>

          <h2 className="rf-login-title">Sign In</h2>

          <form className="rf-login-form" onSubmit={handleSubmit}>
            <div className="rf-login-field">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="rf-login-input cursor-target"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="rf-login-field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="rf-login-input cursor-target"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="rf-login-btn cursor-target">
              Sign In
            </button>
          </form>

          <div className="rf-login-footer">
            <p>
              New to renderFlash?{" "}
              <span className="rf-login-signup cursor-target">
                <Link className="sign-switch" to="/signup">
                  Sign up now
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderFlashLogin;
