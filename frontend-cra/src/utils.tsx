import React from "react";
import { BACKEND_BASE_URL } from "./globalVariables";
import { IUser } from "./UserType";

export const requestLogout = async (setUser: React.Dispatch<React.SetStateAction<IUser>>, navigate) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("requestLogout failed");
    }
    setUser(null);
    navigate("/");
  } catch (error) {
    setUser(null);
    navigate("/");
  }
};

export const requestLogoutAll = async (setUser, navigate) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/users/logoutall`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("requestLogoutAll failed");
    }
    setUser(null);
    navigate("/");
  } catch (error) {
    setUser(null);
    navigate("/");
  }
};

export const truncateStr = (str: string, max: number = 170): string => {
  if (str?.length > max) {
    return str.substring(0, max) + "…";
  }
  return str;
};

export const showValueWithComma = (amount: number, short = false) => {
  if (short && Math.abs(amount) >= 1000) {
    return Number.parseFloat((amount / 1000).toFixed(1)).toLocaleString() + "K";
  }
  return amount;
};

export const dateStrToTimestamp = (str: string): number => {
  // '2021-10-06T13:30:15.312Z' -> 1633527015
  return Math.round(new Date(str).getTime() / 1000);
};

export const timestampToDate = (ts: number): string => {
  // 1633527015 -> '07/10/2021'
  return new Date(ts * 1000).toLocaleDateString();
};
