import { createContext, useState, useEffect } from "react";
import { CheckUser } from "./CheckUser";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    CheckUser(setUser, setIsLoading);
  }, []);

  return <UserContext.Provider value={{ user, setUser, isLoading }}>{children}</UserContext.Provider>;
};
