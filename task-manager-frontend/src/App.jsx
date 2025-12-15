import React from "react";
import { useState, useEffect } from "react";
import Register from "./pages/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthContext } from "./context/AuthContext";
import { userFound } from "../lib/services";

import PrivateRoute from "./privateRoute/PrivateRoute";
import PublicRoute from "./publicRoute/PublicRoute";
import TaskDetail from "./pages/TaskDetail";
import Profile from "./pages/Profile";

const App = () => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const res = await userFound();
    setUser({ auth: res.auth, user: res.user });
  };

  useEffect(() => {
    getUser();
  }, []);

  const router = createBrowserRouter([
    {
      path: "auth/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: "auth/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "auth/forgot-password",
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      path: "auth/reset-password",
      element: (
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      ),
    },
    {
      path: "auth/verifyOTP",
      element: (
        <PublicRoute>
          <VerifyOTP />
        </PublicRoute>
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <>
            <Navbar />
            <Home />
          </>
        </PrivateRoute>
      ),
    },
     {
      path: "/profile",
      element: (
        <PrivateRoute>
          <>
            <Navbar />
            <Profile />
          </>
        </PrivateRoute>
      ),
    },
    {
      path: "/task/:id",
      element: (
        <PrivateRoute>
          <>
            <Navbar />
            <TaskDetail />
          </>
        </PrivateRoute>
      ),
    },
  ]);
  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <div className="min-h-[92vh] w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <RouterProvider router={router} />
        </div>
        <Footer />
      </AuthContext.Provider>
    </>
  );
};

export default App;