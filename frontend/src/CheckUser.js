import { BACKEND_BASE_URL } from "./globalVariables";

export const CheckUser = async (setUser, setIsLoading) => {
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
