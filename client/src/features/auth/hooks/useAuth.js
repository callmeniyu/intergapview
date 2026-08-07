import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { loginUser, logoutUser, registerUser } from "../services/auth.api";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await registerUser({ username, email, password });
      if (data) setUser(data?.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data) setUser(data?.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logoutUser();
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
  };
};
