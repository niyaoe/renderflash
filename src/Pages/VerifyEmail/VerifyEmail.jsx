import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../utils/api";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verificationStarted = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
  if (verificationStarted.current) return;

  verificationStarted.current = true;

  const token = searchParams.get("token");

  console.log("=================================");
  console.log("VERIFY EMAIL PAGE");
  console.log("TOKEN:", token);
  console.log("=================================");

  if (!token) {
    setStatus("error");
    setMessage("Verification token is missing.");
    return;
  }

  const verify = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`
      );

      console.log("=================================");
      console.log("VERIFICATION SUCCESS");
      console.log("STATUS:", res.status);
      console.log("DATA:", res.data);
      console.log("=================================");

      setStatus("success");

      setMessage(
        res.data.message ||
          "Your email has been verified successfully."
      );

    } catch (err) {

      console.log("=================================");
      console.log("VERIFICATION ERROR");
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("ERROR:", err);
      console.log("=================================");

      setStatus("error");

      setMessage(
        err.response?.data?.message ||
          "Verification failed."
      );
    }
  };

  verify();

}, [searchParams]);

  return (
    <div className="rf-verify-page">
      <div className="rf-verify-card">

        <div
          className={`rf-verify-icon ${
            status === "success"
              ? "success"
              : status === "error"
              ? "error"
              : "loading"
          }`}
        >
          {status === "loading" && (
            <span className="rf-verify-spinner"></span>
          )}

          {status === "success" && (
            <i className="bi bi-check-lg"></i>
          )}

          {status === "error" && (
            <i className="bi bi-x-lg"></i>
          )}
        </div>

        <h1 className="rf-verify-title">
          {status === "loading" &&
            "Verifying your email"}

          {status === "success" &&
            "Email verified!"}

          {status === "error" &&
            "Verification failed"}
        </h1>

        <p className="rf-verify-message">
          {message}
        </p>

        {status === "success" && (
          <button
            className="rf-verify-button"
            onClick={() => navigate("/login")}
          >
            Continue to Login
            <i className="bi bi-arrow-right"></i>
          </button>
        )}

        {status === "error" && (
          <button
            className="rf-verify-button"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;