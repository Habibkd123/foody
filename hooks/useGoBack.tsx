"use client";

import { useRouter } from "next/navigation";

const useGoBack = () => {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back(); // Go to previous page
    } else {
      router.push("/"); // Fallback to home
    }
  };

  return goBack;
};

export default useGoBack;