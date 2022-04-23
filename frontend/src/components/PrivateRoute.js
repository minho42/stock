import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};
