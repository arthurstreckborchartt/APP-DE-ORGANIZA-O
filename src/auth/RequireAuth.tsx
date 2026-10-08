import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Spinner } from "@/components/ui/Spinner";

export function RequireAuth() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner />
      </div>
    );
  }
  return session ? <Outlet /> : <Navigate to="/login" replace />;
}
