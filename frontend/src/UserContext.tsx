import React, { createContext, useState, useEffect } from "react";
import { CheckUser } from "./CheckUser";
import { IUser } from "./UserType";

export interface IUserContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  isLoading: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<IUserContext | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(async () => {
  //   CheckUser(setUser, setIsLoading);
  // }, []);

  useEffect(() => {
    async function f() {
      await CheckUser(setUser, setIsLoading);
    }
    f();
  }, []);

  return <UserContext.Provider value={{ user, setUser, isLoading }}>{children}</UserContext.Provider>;
};
