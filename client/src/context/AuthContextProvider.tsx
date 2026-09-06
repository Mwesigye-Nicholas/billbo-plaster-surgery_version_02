import {  useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User} from "../types/authTypes";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
   const navigate = useNavigate();

  const login: AuthContextType["login"]= async (email: string, password: string) => {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    console.log("Login message", result.message);

    if (!response.ok) {
      console.log("Login Failed from authContext provider");
      toast.error(result.message);
      throw new Error("Login Failed");
    }
    toast.success(result.message);
    console.log("Login message: ", result.message);

    setAccessToken(result.data.accessToken);

    setUser(result.data.user);
    setIsAuthenticated(true);
    console.log("Auth Updated:", isAuthenticated);
    
  };

  const register: AuthContextType["register"] = async ( name: string, email:string, role: string, password: string) => {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, role, password})
    })

    //console.log(response)
    if (!response.ok) {
      throw new Error("registration failed.");
    }

    const data: { message: string  } = await response.json();
    toast.success(data.message);

    setRegistrationMessage(data.message);
  }

  const refreshAccessToken: AuthContextType["refreshAccessToken"] = async () => {
    const response = await fetch("http://localhost:5000/api/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to generate Refresh Token");
    }
    const data = await response.json();
    setAccessToken(data.accessToken);
    setIsAuthenticated(true);
  };

  const handleAuthError: AuthContextType["handleAuthError"] = () => {
    toast.error("Session expired, Please login again");
       setTimeout(() => {
      clearAuthState();
      navigate("/login", { replace: true });
    }, 300);
  
  }

  const clearAuthState: AuthContextType["clearAuthState"] = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshAccessToken();
      } catch {
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const logout: AuthContextType["logout"] = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Logout failed");
      }

      console.log("Logout Error: ", result);

      return result.message || "Logged out successfully";

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Logout error: ", error);
        
        throw new Error("Logout Error");
      }
    } finally{
      clearAuthState();
    }
  };

  return (
    <AuthContext.Provider
      value={{
       registrationMessage,
        accessToken,
        isLoading,
        user,
        isAuthenticated,
         register,
        login,
        logout,
        refreshAccessToken,
        clearAuthState,
        handleAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
