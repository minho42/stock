import { useState, useContext } from "react";
import { SiteContext } from "../SiteContext";
import { BACKEND_BASE_URL } from "../globalVariables";

export const requestUpdateUser = async (payload) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("requestUpdateUser failed");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const ProfileEdit = ({ user, setUser, handleProfileEditClose }) => {
  const { toast, toastOptions } = useContext(SiteContext);
  const [name, setName] = useState(user.name);

  const handleSave = async () => {
    const updatedUser = await requestUpdateUser({ name });
    if (!updatedUser) {
      toast.error("Profile update failed", toastOptions);
    }
    toast.success("Profie updated", toastOptions);
    setUser(updatedUser);

    handleProfileEditClose();
  };

  return (
    <div className="space-y-3 py-3 rounded-md border border-gray-300">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-2"
      >
        <div>
          <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value.trim())}
            defaultValue={name}
            type="text"
            id="name"
            className="rounded-md border border-gray-300 px-3 py-1.5 ml-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            defaultValue={user.email}
            type="email"
            id="email"
            className="rounded-md border border-gray-300 px-3 py-1.5 ml-2 text-gray-500"
            disabled
          />
        </div>
      </form>

      <div className="space-x-3">
        <button onClick={handleSave} className="btn-blue">
          Save profile
        </button>
        <button onClick={handleProfileEditClose} className="btn-gray">
          Cancel
        </button>
      </div>
    </div>
  );
};
