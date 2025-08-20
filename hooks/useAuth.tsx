"use client";
import { useEffect, useState } from "react";

type AuthResult = {
  data?: { token?: string };
  user?: any;
};

export function useAuthStorage(result?: AuthResult) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("token");
    }
    return null;
  });

  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(window.localStorage.getItem("G-user") || "{}");
      } catch {
        return {};
      }
    }
    return {};
  });

  // Update state when result changes
  useEffect(() => {
    if (!result) return;
    if (result.data?.token) setToken(result.data.token);
    if (result.user) setUser(result.user);
  }, [result]);

  // Persist to localStorage
  useEffect(() => {
    if (token) {
      window.localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      window.localStorage.setItem("G-user", JSON.stringify(user));
    }
  }, [user]);

  return { token, user, setToken, setUser };
}
