import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { XIcon } from "@heroicons/react/outline";

export const DeleteModal = ({ user, reallyDelete, onClose }) => {
  const [value, setValue] = useState(null);
  const [isMatch, setIsMatch] = useState(false);

  const escClose = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escClose);
    return () => {
      document.removeEventListener("keydown", escClose);
    };
  }, []);

  useEffect(() => {
    // Using useEffect to setIsMatch as useState sets it 1 letter late...
    // https://stackoverflow.com/questions/57403647/changing-state-for-input-is-delayed-by-one-character-usestate-hook

    if (value?.toLowerCase() === user.email?.toLowerCase()) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value.trim());
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-40">
      <div
        id="overlay"
        className="min-h-full min-w-screen bg-black opacity-40"
        onClick={() => onClose()}
      ></div>
      <div className="fixed max-w-md top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-2 bg-white rounded-lg shadow-2xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Are you sure?</h1>
          <span onClick={() => onClose()} className="cursor-pointer">
            <XIcon className="h-6 w-6 m-2" />
          </span>
        </div>
        <p>This action cannot be undone. This will permanently delete your account.</p>
        <p className="border-t border-gray-300"></p>
        <p>
          Plase type <span className="font-semibold">{user.email}</span> to confirm.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col space-y-2"
        >
          <input onChange={handleChange} type="text" className="input" autoFocus />
          <button
            onClick={() => reallyDelete()}
            className={`${isMatch ? "btn-red" : "btn-disabled"}`}
            disabled={!isMatch}
          >
            Delete this account
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
