import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyUser } from "../utils/auth";
import "./ProtectedRoute.css"

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const data = await verifyUser();
      setUser(data);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return (
    <div className="rf-feed-loading">
      <div className="rf-loader"></div>
      <p>Loading...</p>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;