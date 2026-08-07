import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { getUserDetails } from "../services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserDetails();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return <AuthContext.Provider value={[user, setUser, loading, setLoading]}>{children}</AuthContext.Provider>;
};
