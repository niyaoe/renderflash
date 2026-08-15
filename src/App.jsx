import React from "react";
import LandingPage from "./Pages/LandingPage/RenderFlashLanding";
import RenderFlashLogin from "./Pages/LoginPage/RenderFlashLogin";
import SignUpPage from "./Pages/SignUpPage/SignUpPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import About from "./Pages/About/About";
import Feed from "./Pages/Feed_Section/Feed/Feed";
import RenderFlashLayout from "./Pages/Feed_Section/Layout/RenderFlashLayout";
import Search from "./Pages/Feed_Section/Search/Search";
import GlobalChat from "./Pages/Feed_Section/Chat/GlobalChat/GlobalChat";
import Profile from "./Pages/Profile/Profile";
import SettingsLayout from "./Pages/Settings/SettingsLayout/SettingsLayout";
import AccountSettings from "./Pages/Settings/AccountInfo/AccountSettings";
import EditProfile from "./Pages/Settings/EditProfile/EditProfile";
import PrivacySettings from "./Pages/Settings/PrivacySettings/PrivacySettings";
import ChangePassword from "./Pages/Settings/Change Password/ChangePassword";
import Notifications from "./Pages/Notification/Notifications";
import { ToastContainer, Bounce } from "react-toastify";
import ProtectedRoute from "./protect/ProtectedRoute";
import ChatHome from "./Pages/Feed_Section/Chat/ChatHome/ChatHome";
import PrivateRoomHome from "./Pages/Feed_Section/Chat/PrivateChat/PrivateRoomHome";
import RoomChat from "./Pages/Feed_Section/Chat/PrivateChat/RoomChat";
import UploadPost from "./Pages/Feed_Section/UploadPost/UploadPost";
import Users from "./Pages/Users/Users";
import PublicProfile from "./Pages/PublicProfile/PublicProfile";
// import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";

const App = () => {
  return (
    <>
      <div>
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<RenderFlashLogin />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}

            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <RenderFlashLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Feed />} />
              <Route path="feed" element={<Feed />} />
              <Route path="search" element={<Search />} />
              <Route path="chat" element={<ChatHome />} />
              <Route path="chat/global" element={<GlobalChat />} />
              <Route path="chat/private" element={<PrivateRoomHome />} />
              <Route path="chat/private/:roomId" element={<RoomChat />} />
              <Route path="profile" element={<Profile />} />

              <Route path="notifications" element={<Notifications />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<PublicProfile />} />
              <Route path="upload" element={<UploadPost />} />

              <Route
                path="main/settings/edit-profile"
                element={<EditProfile />}
              />

              <Route path="/main/settings" element={<SettingsLayout />}>
                <Route index element={<AccountSettings />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="privacy" element={<PrivacySettings />} />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
