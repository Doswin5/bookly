import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return user.role === "admin" ? children : <Navigate to="/slots" replace />;
}