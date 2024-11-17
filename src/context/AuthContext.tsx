import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for a stored token when loading the app
    if (!token) {
      const publicRoutes = ["/login", "/register"];
      const token = localStorage.getItem("authToken");
      if (token) {
        setToken(token);
        if (publicRoutes.includes(location.pathname)) {
          navigate("/dashboard");
        }
      } else {
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/login");
        }
      }
    }
  }, [location.pathname, navigate, token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
