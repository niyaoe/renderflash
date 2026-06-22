import { NavLink, Outlet } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import {
  MdOutlineDynamicFeed,
} from "react-icons/md";
import {
  RiGlobalFill,
} from "react-icons/ri";
import {
  CgProfile,
} from "react-icons/cg";

import { IoPeople } from "react-icons/io5";

import "./RenderFlashLayout.css";

export default function RenderFlashLayout() {
  return (
    <div className="reddit-layout">

      {/* HEADER */}
      <header className="reddit-header">
        <div className="reddit-header-inner">

          <div className="rf-feed-logo">
            renderFlash<span>.io</span>
          </div>

          <div className="reddit-search">
            <FaSearch />
            <input placeholder="Search RenderFlash" />
          </div>

          <div className="reddit-actions">
            <NavLink to="users">
              <i class="bi bi-people-fill"></i>
            </NavLink>

            <NavLink to="notifications">
              <i className="bi bi-bell-fill"></i>
            </NavLink>

            <NavLink to="upload">
              <i className="bi bi-plus-square"></i>
            </NavLink>
          </div>

        </div>
      </header>

      {/* BODY */}
      <div className="reddit-body">

        {/* SIDEBAR */}
        <aside className="reddit-sidebar">
          <NavLink to="feed">
            <MdOutlineDynamicFeed />
            Feed
          </NavLink>

          <NavLink to="search">
            <FaSearch />
            Search
          </NavLink>

          <NavLink to="chat">
            <RiGlobalFill />
            Explore
          </NavLink>

          <NavLink to="profile">
            <CgProfile />
            Profile
          </NavLink>
        </aside>

        {/* CONTENT */}
        <main className="reddit-content">
          <Outlet />
        </main>

      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="reddit-mobile-nav">
        <NavLink to="feed">
          <MdOutlineDynamicFeed />
        </NavLink>

        <NavLink to="search">
          <FaSearch />
        </NavLink>

        <NavLink to="chat">
          <RiGlobalFill />
        </NavLink>

        <NavLink to="profile">
          <CgProfile />
        </NavLink>
      </nav>

    </div>
  );
}