import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "./DeleteModal";
import { ProfileEdit } from "./ProfileEdit";
import { BACKEND_BASE_URL } from "../globalVariables";
import { requestLogout, requestLogoutAll } from "../utils";
import { OwnedStocks } from "./OwnedStocks";

export const requestDeleteAccount = async (user, setUser, navigate) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/users/me`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("requestDeleteAccount failed");
    }
    setUser(null);
    navigate("/");
  } catch (error) {
    setUser(null);
    navigate("/");
  }
};

export const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const handleProfileEditClose = () => {
    setIsProfileEditOpen(false);
  };

  return (
    <div className="flex justify-center text-center py-3">
      <div className="flex flex-col w-full px-4 space-y-6 max-w-xl">
        <div className="">
          {!isProfileEditOpen && (
            <div className="">
              <div>Name: {user.name}</div>
              <div>Email: {user.email}</div>
              <button onClick={() => setIsProfileEditOpen(true)} className="link-blue">
                Edit profile
              </button>
            </div>
          )}
          {isProfileEditOpen && (
            <ProfileEdit user={user} setUser={setUser} handleProfileEditClose={handleProfileEditClose} />
          )}
        </div>

        {/* <OwnedStocks /> */}

        <div className="flex flex-col space-y-3">
          <div>
            <button onClick={() => requestLogout(setUser, navigate)} className="link-blue">
              Log out
            </button>
          </div>
          <div>
            <button onClick={() => requestLogoutAll(setUser, navigate)} className="link-blue">
              Log out from all devices
            </button>
          </div>
        </div>

        <div className="">
          <button
            onClick={handleDelete}
            // ref="/profile/delete"
            className="link-red"
          >
            Delete account
          </button>
        </div>
        {isDeleteModalOpen && (
          <DeleteModal
            user={user}
            reallyDelete={() => requestDeleteAccount(user, setUser, navigate)}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
