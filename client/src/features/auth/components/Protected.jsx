import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import Loader from "../../../components/Loader";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-900 via-brand-950 to-[#140b03]">
        <Loader message="Authenticating..." />
      </div>
    );
  }
  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default Protected;
