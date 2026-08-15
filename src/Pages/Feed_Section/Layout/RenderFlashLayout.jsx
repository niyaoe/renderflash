import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlineDynamicFeed } from "react-icons/md";
import { RiGlobalFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

import "./RenderFlashLayout.css";
import Users from "../../Users/Users";
import UsersDropdown from "./RightBar/UsersDropdown";
import { useState } from "react";
import UploadPost from "../UploadPost/UploadPost";
import logo from "../../../assets/logo/Artboard 1@3x hello.png";

export default function RenderFlashLayout() {
  const navigate = useNavigate();

  return (
    <div className="reddit-layout">
      {/* HEADER */}
      <header className="reddit-header">
        <div className="reddit-header-inner">
          <div className="rf-feed-logo">
            {/* renderFlash<span>.io</span> */}
            <img className="rf-new-logo" src={logo} alt="" />
          </div>

          <div className="reddit-search">
            <FaSearch />
            <input placeholder="Search RenderFlash" />
          </div>

          <div className="reddit-actions">
            <NavLink to="notifications">
              <i className="bi bi-bell-fill"></i>
            </NavLink>
            <NavLink to="users">
              <i className="bi bi-people-fill"></i>
            </NavLink>

            <NavLink to="upload">
              <i className="bi bi-plus-square"></i>
            </NavLink>
          </div>
        </div>
      </header>

      <div className="reddit-body">
        {/* LEFT SIDEBAR */}
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

          <NavLink to="/main/settings">
            <i className="bi bi-gear-fill"></i>
            Settings
          </NavLink>
        </aside>

        {/* CENTER */}
        <main className="reddit-content">
          <Outlet />
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="reddit-rightbar">
          <div className="rf-panel">
            <div className="rf-panel-title">
              <i className="bi bi-people-fill"></i>
              Users
            </div>

            <div className="rf-panel-content">
              <UsersDropdown />
            </div>
          </div>

          <div className="rf-panel">
            <div className="rf-panel-title">
              <i className="bi bi-search"></i>
              Discover
            </div>

            <div className="rf-panel-content">Search Categories </div>
          </div>

          <div className="rf-panel">
            <div className="rf-panel-title">
              <i className="bi bi-fire"></i>
              Trending
            </div>

            <div className="rf-panel-content">upcoming update</div>
          </div>
        </aside>
      </div>

      {/* MOBILE NAV */}
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
