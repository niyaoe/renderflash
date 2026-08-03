
import React, { useEffect } from "react";
import "./RenderFlashLanding.css";
import { Link, useNavigate } from "react-router-dom";
import TargetCursor from "../../Blits/TargetCursor";
import GradientText from "../../componentblits/GradientText";
import { useTranslation } from "react-i18next";
import { verifyUser } from "../../utils/auth";

const RenderFlashLanding = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const check = async () => {
      const user = await verifyUser();

      if (user) {
        navigate("/main/profile");
      }
    };

    check();
  }, [navigate]);

  return (
    <div className="rf-landing">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      {/* ================= NAVBAR ================= */}
      <header className="rf-landing-header">
        <nav className="rf-landing-navbar">

          {/* LOGO */}
          <div className="rf-landing-logo cursor-target">
            {t("title")}
          </div>

          {/* NAV RIGHT */}
          <div className="rf-landing-nav-right">

            {/* LANGUAGE */}
            <div className="rf-language-container">
              <select
                className="rf-language-select cursor-target"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                {/* <option value="hi">Hindi</option> */}
                <option value="ar">Arabic</option>
                {/* <option value="jn">Japanese</option> */}
                {/* <option value="tl">Tamil</option> */}
                {/* <option value="ml">Malayalam</option> */}
              </select>

              <i className="bi bi-chevron-down rf-language-icon"></i>
            </div>

            {/* SIGN IN */}
            {/* <Link
              to="/login"
              className="rf-landing-signin cursor-target"
            >
              {t("signin")}
              <i className="bi bi-arrow-up-right"></i>
            </Link> */}

          </div>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <main className="rf-landing-main">

        {/* BACKGROUND EFFECTS */}
        <div className="rf-landing-glow rf-glow-one"></div>
        <div className="rf-landing-glow rf-glow-two"></div>

        <div className="rf-landing-grid"></div>

        {/* HERO CONTENT */}
        <section className="rf-landing-hero">

          {/* <div className="rf-hero-badge cursor-target">
            <span className="rf-status-dot"></span>
            <span>Creative community for editors</span>
          </div> */}

          <GradientText
            colors={["#621eff", "#d3c7ff"]}
            animationSpeed={7}
            showBorder={false}
            className="rf-gradient-title"
          >
            <h1 className="rf-landing-title cursor-target">
              {t("hero_title")}
            </h1>
          </GradientText>

          <p className="rf-landing-description">
           { t("tagline_1")}
            <br />
            { t("tagline_2")}
          </p>

          {/* CTA */}
          <div className="rf-landing-actions">

            <Link
              to="/login"
              className="rf-primary-btn cursor-target"
            >
              <span>{t("signin")}</span>
              <i className="bi bi-arrow-right"></i>
            </Link>

            <Link
              to="/login"
              className="rf-secondary-btn cursor-target"
            >
              Explore RenderFlash
              <i className="bi bi-compass"></i>
            </Link>

          </div>

          {/* SMALL INFO */}
          {/* <div className="rf-landing-meta">

            <div className="rf-meta-item">
              <i className="bi bi-play-circle"></i>
              <span>Share your edits</span>
            </div>

            <div className="rf-meta-divider"></div>

            <div className="rf-meta-item">
              <i className="bi bi-people"></i>
              <span>Connect with creators</span>
            </div>

            <div className="rf-meta-divider"></div>

            <div className="rf-meta-item">
              <i className="bi bi-stars"></i>
              <span>Discover creativity</span>
            </div>

          </div> */}

        </section>

        {/* BOTTOM DECORATION */}
        {/* <div className="rf-hero-bottom">
          <span></span>
          <span></span>
          <span></span>
        </div> */}

      </main>
    </div>
  );
};

export default RenderFlashLanding;

