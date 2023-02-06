import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormError } from "./FormError";
import { BACKEND_BASE_URL } from "../globalVariables";
import { IUser } from "../UserType";

const initialValues = { email: "", password: "" };
const validationSchema = Yup.object().shape({
  email: Yup.string().email("not a valid email").required("required"),
  password: Yup.string().min(7, "too short").required("required"),
});

export const requestLogin = async (
  email: string,
  password: string,
  setUser: React.Dispatch<React.SetStateAction<IUser>>
) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("requestLogin failed");
    }
    const { user } = await res.json();
    setUser(user);
    return user;
  } catch (error) {
    console.log(error);
    setUser(null);
    return null;
  }
};

export const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    const loggedinUser = await requestLogin(email, password, setUser);
    if (loggedinUser) {
      return navigate("/");
    }
    // TODO: Needs to show different error message if login failure is not from wrong email/password...
    setErrorMessage("Login failed");
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full px-4">
        {!user ? (
          <div className="space-y-4 m-3">
            <span className="text-2xl font-medium">Log in</span>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                await handleLogin(values);
                setSubmitting(false);
                // resetForm();
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
                return (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="font-semibold">
                        Email
                      </label>
                      <input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        type="email"
                        id="email"
                        className="input w-full"
                      />
                      <FormError touched={touched} message={errors.email} />
                    </div>
                    <div>
                      <label htmlFor="password" className="font-semibold">
                        Password
                      </label>
                      <input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        type="password"
                        id="password"
                        className="input w-full"
                      />
                      <FormError touched={touched} message={errors.password} />
                    </div>
                    {errorMessage && <FormError touched={touched} message={errorMessage} />}

                    <div>
                      <button type="submit" className="w-full btn-blue" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log in"}
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>

            {/* <div>
              <Link to="/password/reset" className="ml-2 link-blue">
                Forgot Password?
              </Link>
            </div> */}
            <div>
              Don't have an account?
              <Link to="/signup" className="ml-2 link-blue">
                Sign up
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">hi {user.email}</div>
        )}
      </div>
    </div>
  );
};
