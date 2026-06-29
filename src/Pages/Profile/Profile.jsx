import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import ProfileTabs from "./ProfileTabs/ProfileTabs";
import axios from "axios";
import { API_URL } from "../../utils/api" 

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return (
    <div className="rf-feed-loading">
      <div className="rf-loader"></div>
      <p>Loading...</p>
    </div>
  );


  return (
    <div>
      <div className="profile-section">
        <div className="profile-card">
          {/* Top Section */}
          <div className="outer-profile">
            <div className="profile-top">
              <img src={user.avatar} alt="profile" className="profile-image" />

              <div className="profile-info">
                <h2 className="profile-username">
                  {user.username}
                  {user.country && (
                    <span className="country-p">{user.country}</span>
                  )}
                </h2>

                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">5</span>
                    <span className="stat-label">Edits</span>
                  </div>

                  <div className="stat">
                    <span className="stat-number">
                      {user.followers?.length || 0}
                    </span>
                    <span className="stat-label">Fans</span>
                  </div>

                  {/* <div className="stat">
                    <span className="stat-number">
                      {user.following?.length || 0}
                    </span>
                    <span className="stat-label">Following</span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right icons */}
            <div className="profile-right">
              <Link
                to="/main/settings"
                className="profile-settings-link"
              >
                <i className="bi bi-gear-fill"></i>
              </Link>

              <Link
                to="/main/settings/edit-profile"
                className="profile-settings-link"
              >
                <i className="bi bi-pencil-square"></i>
              </Link>
            </div>
          </div>

          {/* Bio Section */}
          <div className="profile-bio">
            <p>{user.name}</p>
            <p className="bio-p">{user.bio}</p>

            {/* softwares */}
            {user.softwares?.map((soft, index) => (
              <p className="software-p" key={index}>{soft}</p>
            ))}

            {/* country */}
          </div>
        </div>
      </div>

      <ProfileTabs />
    </div>
  );
};

export default Profile;
