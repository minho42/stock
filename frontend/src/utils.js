import { BACKEND_BASE_URL } from "./globalVariables";

export const requestLogout = async (user, setUser, navigate) => {
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

export const requestLogoutAll = async (user, setUser, navigate) => {
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

export const truncateStr = (str, max = 170) => {
  if (str?.length > max) {
    return str.substring(0, max) + "…";
  }
  return str;
};

export const isPositive = (str) => {
  return Math.sign(Number.parseFloat(str)) >= 0;
};

export const showValueWithSign = (str, prefix = "", suffix = "") => {
  if (Math.sign(Number.parseFloat(str)) > 0) {
    return `+${prefix}${showValueWithComma(str)}${suffix}`;
  } else if (Math.sign(Number.parseFloat(str)) < 0) {
    return `-${prefix}${showValueWithComma(Math.abs(str))}${suffix}`;
  } else {
    return `${prefix}${showValueWithComma(Math.abs(str))}${suffix}`;
  }
};

export const showValueWithComma = (str, short = false) => {
  if (short && Math.abs(Number.parseFloat(str)) >= 1000) {
    return Number.parseFloat(Number.parseFloat(str / 1000).toFixed(1)).toLocaleString() + "K";
  }
  return Number.parseFloat(Number.parseFloat(str).toFixed(2)).toLocaleString();
};

export const dateStrToTimestamp = (str) => {
  // '2021-10-06T13:30:15.312Z' -> 1633527015
  return Math.round(new Date(str).getTime() / 1000);
};

export const timestampToDate = (ts) => {
  // 1633527015 -> '07/10/2021'
  return new Date(ts * 1000).toLocaleDateString();
};

export const getChangePercentage = (total, change) => {
  return (
    (Number.parseFloat(Number.parseFloat(change).toFixed(2)) / Number.parseFloat(total - change)) *
    100
  ).toFixed(2);
};
