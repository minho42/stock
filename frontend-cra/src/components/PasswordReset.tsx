import React, { useState } from "react";

export const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    // request to: Send email to reset password...
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full px-4 p-4">
        <div className="space-y-4 m-3">
          <span className="text-2xl font-medium">Reset password</span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input w-full"
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <div>
              <button onClick={handlePasswordReset} className="btn-blue w-full">
                Reset password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
