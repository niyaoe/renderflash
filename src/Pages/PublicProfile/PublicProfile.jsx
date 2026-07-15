import React, { useEffect, useState } from "react";
import "./PublicProfile.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../../utils/api";

const PublicProfile = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const token = localStorage.getItem("token");
  // console.log(token, "token from public profile ");

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const profileRes = await axios.get(`${API_URL}/api/user/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(profileRes.data);

      const meRes = await axios.get(`${API_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFollowing(meRes.data.following?.includes(id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFollowing(res.data.following);

      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user)
    return (
      <div className="rf-feed-loading">
        <div className="rf-loader"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div>
      <div className="public-profile-section">
        <div className="public-profile-card">
          <div className="public-outer-profile">
            <div className="public-profile-top">
              <img
                src={user.avatar}
                alt="profile"
                className="public-profile-image"
              />

              <div className="public-profile-info">
                <h2 className="public-profile-username">
                  {user.username}

                  {user.country && (
                    <span className="public-country-p">{user.country}</span>
                  )}
                </h2>

                <div className="public-profile-stats">
                  <div className="public-stat">
                    <span className="public-stat-number">0</span>
                    <span className="public-stat-label">Edits</span>
                  </div>

                  <div className="public-stat">
                    <span className="public-stat-number">
                      {user.followers?.length || 0}
                    </span>
                    <span className="public-stat-label">Fans</span>
                  </div>

                  <div className="public-stat">
                    <span className="public-stat-number">
                      {user.following?.length || 0}
                    </span>
                    <span className="public-stat-label">Following</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                className={`follow-btn ${following ? "following" : ""}`}
                onClick={handleFollow}
              >
                {following ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          <div className="public-profile-bio">
            <p>{user.name}</p>

            <p className="public-bio-p">{user.bio}</p>

            {user.softwares?.map((soft, index) => (
              <p className="public-software-p" key={index}>
                {soft}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
