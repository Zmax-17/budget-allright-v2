import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";
interface PrivateRouteProps {
  children: ReactNode;
}
export default function PrivateRoute({
  children,
}: PrivateRouteProps) {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children; // render child elements (Layout and nested routes)
}
