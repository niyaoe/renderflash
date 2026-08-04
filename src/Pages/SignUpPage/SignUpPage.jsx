import React, { useState } from "react";
import "./RenderFlashSignup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { toast } from "react-toastify";
import TargetCursor from "../../Blits/TargetCursor";
import logo from "../../assets/logo/Artboard 1@3x hello.png";

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
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Store token
      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.user.username,
          avatar: res.data.user.avatar,
        }),
      );

      toast.success("Signup successful");

      // Redirect after signup
      navigate("/main/profile");
    } catch (err) {
      console.log(err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="rf-signup-page">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />
      <main className="rf-signup-main">
        <div className="rf-signup-card">
          {/* TITLE */}
          <Link to="/">
            <img className="title_logo cursor-target" src={logo} alt="" />
          </Link>

          {/* <div className="rf-signup-heading">
            <Link to="/" className="rf-signup-logo">
              renderFlash
            </Link>

            <h1>Sign Up</h1>

            <p>Create your RenderFlash account</p>
          </div> */}

          {/* FORM */}
          <form className="rf-signup-form" onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div className="rf-signup-field ">
              <label htmlFor="rf-signup-username">Username</label>

              <div className="rf-signup-input-wrapper">
                <i className="bi bi-person"></i>

                <input
                  id="rf-signup-username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className="rf-signup-input cursor-target"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="rf-signup-field">
              <label htmlFor="rf-signup-email">Email</label>

              <div className="rf-signup-input-wrapper">
                <i className="bi bi-envelope"></i>

                <input
                  id="rf-signup-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="rf-signup-input cursor-target"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="rf-signup-field">
              <label htmlFor="rf-signup-password">Password</label>

              <div className="rf-signup-input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  id="rf-signup-password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="rf-signup-input cursor-target"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="rf-signup-field">
              <label htmlFor="rf-signup-confirm-password">
                Confirm Password
              </label>

              <div className="rf-signup-input-wrapper">
                <i className="bi bi-shield-lock"></i>

                <input
                  id="rf-signup-confirm-password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="rf-signup-input cursor-target"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* SIGNUP BUTTON */}
            <button type="submit" className="rf-signup-btn cursor-target">
              <span>Create Account</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          {/* FOOTER */}
          <div className="rf-signup-footer">
            <span>Already in renderFlash?</span>

            <Link to="/login" className="rf-signup-login cursor-target">
              Sign in now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
