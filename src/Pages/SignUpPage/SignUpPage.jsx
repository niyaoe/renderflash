import React, { useState } from "react";
import "../LoginPage/RenderFlashLogin.css";
import { Link, useNavigate } from "react-router-dom";
import TargetCursor from "../../Blits/TargetCursor";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { toast, Bounce } from "react-toastify";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
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

      // redirect to profile/home
      navigate("/main/profile");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="rf-login-wrapper">
      {/* <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      /> */}

      <div className="rf-login-container">
        <div className="rf-login-card">
          <Link className="loginPage-title" to="/">
            <h2 className="rf-login-logo cursor-target">renderFlash</h2>
          </Link>

          <h2 className="rf-login-title">Sign Up</h2>

          <form className="rf-login-form" onSubmit={handleSubmit}>
            <div className="rf-login-field">
              <input
                type="text"
                name="username"
                placeholder="username"
                className="rf-login-input cursor-target"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="rf-login-field">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
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

            <div className="rf-login-field">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="rf-login-input cursor-target"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="rf-login-btn cursor-target">
              Sign Up
            </button>
          </form>

          <div className="rf-login-footer">
            <p>
              Already in renderFlash?{" "}
              <span className="rf-login-signup cursor-target">
                <Link className="sign-switch" to="/login">
                  Sign in now
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
