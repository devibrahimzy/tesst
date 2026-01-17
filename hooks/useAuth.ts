import { useAuthStore } from "@/features/auth/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/features/auth/auth.service";

export function useAuth() {
  const { user, token, setAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      if (!token && typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          try {
            const userProfile = await authService.getProfile();
            setAuth(storedToken, userProfile);
          } catch {
            localStorage.removeItem("token");
          }
        }
      }
    };

    initAuth();
  }, [token, setAuth]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    router.push("/login");
  };

  return { user, token, logout: handleLogout, isAuthenticated: !!token };
}
