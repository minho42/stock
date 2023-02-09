import React from "react";
import { BACKEND_BASE_URL } from "./globalVariables";
import { IUser } from "./UserType";

export const CheckUser = async (
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/users/check`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("authentication failed from jwt in cookie");
    }
    const user = await res.json();
    if (!user) {
      throw new Error("no user");
    }

    setUser(user);
    setIsLoading(false);
    return true;
  } catch (error) {
    console.log(error);
    setUser(null);
    setIsLoading(false);
    return false;
  }
};
