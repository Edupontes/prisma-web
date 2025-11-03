import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("http://localhost:4000/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        setAuthorized(false);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Verificando sessão...</div>;
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
