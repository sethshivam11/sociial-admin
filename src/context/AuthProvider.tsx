"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const initialState = {
  isLoggedIn: false,
  setIsLoggedIn: (loggedIn: boolean) => {},
};

const AuthContext = createContext(initialState);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsedToken = JSON.parse(token) || { token: "", expiry: "" };
      const isTokenExpired = new Date() > new Date(parsedToken?.expiry);
      if (parsedToken && !isTokenExpired) setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
