"use client";
import { useEffect, useState } from "react";

type AuthResult = {
  data?: { token?: string };
  user?: any;
};

export function useAuthStorage(result?: AuthResult) {
  const [token, setToken] = useState<string | null>(null);
  const [localUserId, setLocalUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>(null);

  // ✅ Fetch cookie-based auth data
  const checkcookies = async () => {
    try {
      const res = await fetch("/api/auth/set-cookies", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("Auth Storage Data:", data.user.role);

      if (data.success) {
        setToken(data.token);
        setLocalUserId(data.user_id);
        setUser(data.userAuth);
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error("Failed to fetch auth cookies:", error);
    }
  };

  // ✅ Fetch full user details by ID
  const getUserData = async () => {
    if (!localUserId) return;

    try {
      const res = await fetch(`/api/users/${localUserId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("Fetched User Data:", data);
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    checkcookies();
  }, []);

  useEffect(() => {
    if (localUserId) {
      getUserData();
    }
  }, [localUserId]);

  // ✅ Update user profile
  const updateUser = async (userData: any) => {
    if (!localUserId) {
      throw new Error("User ID not available");
    }

    try {
      const res = await fetch(`/api/users/${localUserId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log("Updated User Data:", data);
      
      if (data.success) {
        setUser(data.data);
        return data.data;
      } else {
        throw new Error(data.error || "Failed to update user profile");
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw error;
    }
  };

  // ✅ Logout user and clear cookies
  const logout = async () => {
    try {
      const res = await fetch("/api/auth/set-cookies", {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("Logout response:", data);
      
      if (data.success) {
        // Clear local state
        setUser(null);
        setToken(null);
        setLocalUserId(null);
        return true;
      } else {
        throw new Error(data.error || "Failed to logout");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  };

  console.log("useAuthStorage userId:", localUserId);
  return { token, user, setToken, setUser, updateUser, logout ,userRole,checkcookies};
}
