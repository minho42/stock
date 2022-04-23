import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { SiteProvider } from "./SiteContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";
import { Navbar } from "./components/Navbar";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { PasswordReset } from "./components/PasswordReset";
import { Profile } from "./components/Profile";
import { About } from "./components/About";
import { Journals } from "./components/Journals.js";
import { Dashboard } from "./components/Dashboard";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <SiteProvider>
            <ToastContainer />
            <Navbar />
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password/reset" element={<PasswordReset />} />
              <Route path="/about" element={<About />} />
              <Route path="/" element={<Journals />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </SiteProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
