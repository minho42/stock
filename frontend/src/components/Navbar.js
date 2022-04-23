import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserCircleIcon, LogoutIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { requestLogout, truncateStr } from "../utils";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="mb-3">
      <header className="flex justify-between border-b border-gray-200 text-base bg-white px-2 sm:px-5">
        <div className="flex items-center">
          <div className="flex items-start">
            <Link to="/">
              <div className="font-bold uppercase text-2xl bg-black text-white px-3 py-1 rounded-md">IJ</div>
            </Link>
            <div className="bg-purple-200 ml-1 px-2 py-0.5 rounded-full text-sm font-normal normal-case">
              beta
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-14">
          <Link to="/" className="navbar-link">
            Journals
          </Link>

          {!user && (
            <Link to="/signup" className="navbar-link font-semibold">
              Signup
            </Link>
          )}
          {!user && (
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          )}
          {user && (
            <>
              <button onClick={toggleDropdown} className="navbar-link relative z-50">
                <UserCircleIcon className="w-7 h-7 " />
              </button>

              {isDropdownOpen && (
                <div onClick={toggleDropdown} className="fixed inset-0 cursor-default">
                  <div id="dropdown-overlay" className="min-h-full min-w-screen bg-transparent"></div>
                </div>
              )}

              {isDropdownOpen && (
                <section className="z-50 absolute top-14 right-0 transform bg-white rounded-xl border border-gray-200 shadow-xl py-3 cursor-default w-full max-w-xs">
                  <div className="flex flex-col flex-shrink-0">
                    <ul onClick={toggleDropdown} className="text-center">
                      {user.isSuperuser && (
                        <>
                          <Link to="/dashboard">
                            <li className="hover:bg-gray-100 px-3 py-3 cursor-pointer">Dashboard</li>
                          </Link>
                          <li className="dropdown-divider" />
                        </>
                      )}

                      <Link to="/profile">
                        <li className="px-3 py-3 cursor-pointer">
                          <span className="font-semibold">{truncateStr(user.email, 28)}</span>
                        </li>
                      </Link>
                      <li className="dropdown-divider" />
                      <Link to="/profile">
                        <li className="hover:bg-gray-100 px-3 py-3 cursor-pointer">Your profile</li>
                      </Link>
                      <li className="dropdown-divider" />
                      <li
                        onClick={() => requestLogout(user, setUser, navigate)}
                        className="hover:bg-gray-100 px-3 py-3 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <LogoutIcon className="w-6 h-6" />
                        Log out
                      </li>
                      <li className="dropdown-divider" />
                      <Link to="/about">
                        <li className="hover:bg-gray-100 px-3 py-3 cursor-pointer">About</li>
                      </Link>
                    </ul>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </header>
    </nav>
  );
};
