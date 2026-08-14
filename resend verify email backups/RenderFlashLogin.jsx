import React, { useState } from "react";
import "./RenderFlashLogin.css";
import { Link, useNavigate } from "react-router-dom";
import TargetCursor from "../../Blits/TargetCursor";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { toast } from "react-toastify";
import logo from "../../assets/logo/Artboard 1@3x hello.png";

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

      // Store token
      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data.user._id,
          username: res.data.user.username,
          avatar: res.data.user.avatar,
          email: res.data.user.email,
        }),
      );

      toast.success("Login successful");

      // Redirect after login
      navigate("/main/profile");
    } catch (err) {
      console.log(err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="rf-login-page">
      {/* CUSTOM CURSOR */}
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      {/* CENTER CARD */}
      <main className="rf-login-main">
        <div className="rf-login-card">
          <Link to="/">
            <img className="title_logo cursor-target" src={logo} alt="" />
          </Link>

          {/* TITLE */}
          {/* <Link to="/" className="rf-login-title-link cursor-target">
            <h1 className="rf-login-title">renderFlash</h1>
          </Link>

          <p className="rf-login-subtitle">
            Welcome back
          </p> */}

          {/* FORM */}
          <form className="rf-login-form" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="rf-login-field">
              <label htmlFor="rf-login-email">Email</label>

              <div className="rf-login-input-wrapper">
                <i className="bi bi-envelope"></i>

                <input
                  id="rf-login-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="rf-login-input cursor-target"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="rf-login-field">
              <label htmlFor="rf-login-password">Password</label>

              <div className="rf-login-input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  id="rf-login-password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="rf-login-input cursor-target"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button type="submit" className="rf-login-btn cursor-target">
              <span>Sign In</span>

              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          {/* FOOTER */}
          <div className="rf-login-footer">
            <span>New to renderFlash?</span>

            <Link to="/signup" className="rf-login-signup cursor-target">
              Sign up now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RenderFlashLogin;
