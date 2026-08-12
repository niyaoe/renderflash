import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../utils/api";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  const [message, setMessage] = useState(
    "Verifying your email..."
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {

        const res = await axios.get(
          `${API_URL}/api/auth/verify-email?token=${token}`
        );

        setStatus("success");

        setMessage(
          res.data.message ||
            "Your email has been verified successfully."
        );

      } catch (err) {

        console.log(err);

        setStatus("error");

        setMessage(
          err.response?.data?.message ||
            "Verification failed."
        );
      }
    };

    verifyEmail();

  }, [searchParams]);

  return (
    <div className="rf-verify-page">

      <div className="rf-verify-card">

        {/* ICON */}

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

        {/* TITLE */}

        <h1 className="rf-verify-title">

          {status === "loading" &&
            "Verifying your email"}

          {status === "success" &&
            "Email verified!"}

          {status === "error" &&
            "Verification failed"}

        </h1>

        {/* MESSAGE */}

        <p className="rf-verify-message">
          {message}
        </p>

        {/* SUCCESS */}

        {status === "success" && (
          <button
            className="rf-verify-button"
            onClick={() => navigate("/login")}
          >
            Continue to Login

            <i className="bi bi-arrow-right"></i>
          </button>
        )}

        {/* ERROR */}

        {status === "error" && (
          <Link
            to="/signup"
            className="rf-verify-button"
          >
            Create Account
          </Link>
        )}

      </div>

    </div>
  );
};

export default VerifyEmail;