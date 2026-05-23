import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const { user, token, isLoading, error, login, register, logout, clearError } =
    useAuthStore();

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
