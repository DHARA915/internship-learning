

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ComponentType } from "react";

import type { RootState } from "../Redux/store";

type Role = "admin" | "user";

const HOME: Record<Role, string> = {
  admin: "/admin/dashboard",
  user: "/user",
};

function withAuth<P extends object>(
  Component: ComponentType<P>,
  allowedRole: Role
) {
  return function ProtectedComponent(props: P) {
    const currentUser = useSelector(
      (state: RootState) => state.auth.currentUser
    );

  console.log("currentUser", currentUser);

 

    const userEmail = localStorage.getItem("userEmail");
    console.log("userEmail", userEmail);

    // // Not logged in
    if (!userEmail) {
      return <Navigate to="/login" replace />;
    }

    // // Logged in, but user data not loaded yet: WAIT, don't redirect
    // if (!currentUser) {
    //   return <div className="p-6">Loading...</div>;
    // }

    // // Loaded, but wrong role: send to their own home
    // if (currentUser.role !== allowedRole) {
    //   return <Navigate to={HOME[currentUser.role]} replace />;
    // }

    return <Component {...props} />;
  };
}

export default withAuth;