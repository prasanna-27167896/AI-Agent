import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (protectedRoute) {
      if (!token) {
        navigate("/signup", { replace: true }); // ✅ use replace to prevent back nav
      }
    } else {
      if (token) {
        navigate("/", { replace: true });
      }
    }

    setLoading(false);
  }, [navigate, protectedRoute]);

  if (loading) return <div>Loading...</div>;

  return children;
}

export default CheckAuth;
