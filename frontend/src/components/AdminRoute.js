import { useContext } from "react";
import { UserContext } from "../UserContext";

export const AdminRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return user && user.isSuperuser ? children : <div className="text-center">403 Forbidden</div>;
};
