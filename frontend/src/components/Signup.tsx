import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import { requestLogin } from "./Login";
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

export const Signup: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const requestSignup = async (email: string, password: string): Promise<IUser | null> => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        console.log(res.statusText);
        throw new Error("requestSignup error");
      }
      const { user } = await res.json();
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleSignup = async ({ email, password }) => {
    try {
      const signedupUser = await requestSignup(email, password);
      if (!signedupUser) {
        setErrorMessage("Sign up failed");
        throw new Error("requestSignup failed");
      }
      const loggedinUser = await requestLogin(email, password, setUser);
      if (!loggedinUser) {
        setErrorMessage("Login as new user failed");
        throw new Error("requestLogin failed");
      }
      return navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full px-4">
        <div className="space-y-4 m-3">
          <span className="text-2xl font-medium">Sign up</span>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              await handleSignup(values);
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
                      {isSubmitting ? "Signing up..." : "Sign up"}
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>

          <div>
            Have an account?
            <Link to="/login" className="ml-2 link-blue">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
