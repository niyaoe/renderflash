import { NavLink, Outlet } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlineDynamicFeed } from "react-icons/md";
import { RiGlobalFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import "./RenderFlashLayout.css";

export default function RenderFlashLayout() {
  return (
    <div className="rf-layout-wrapper">
      {/* ===== HEADER ===== */}
      <header className="rf-main-header">
        <div className="rf-header-inner rf-container">
          {/* ⭐ LOGO ROW */}
          <div className="rf-header-top">
            <div className="rf-feed-logo">
              renderFlash<span style={{ color: "white" }}>.io</span>
            </div>

            <div className="rf-header-icons">
              <NavLink to="notifications">
                <i className="bi bi-bell-fill notification-icon"></i>
              </NavLink>
              <NavLink to="upload">
              <i className="bi bi-plus-square"></i>
              </NavLink>
            </div>
          </div>

          {/* TABS */}
          <div className="rf-feed-tabs">
            <NavLink to="feed" className="rf-tab-btn">
              <MdOutlineDynamicFeed />
            </NavLink>
            <NavLink to="search" className="rf-tab-btn">
              <FaSearch />
            </NavLink>
            <NavLink to="chat" className="rf-tab-btn">
              <RiGlobalFill />
            </NavLink>
            <NavLink to="profile" className="rf-tab-btn">
              <CgProfile />
            </NavLink>
          </div>
        </div>
      </header>

      {/* ===== PAGE CONTENT ===== */}
      <main className="rf-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
