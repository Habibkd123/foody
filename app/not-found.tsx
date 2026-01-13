"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div>
          <div className="text-7xl font-extrabold text-gray-900 dark:text-white">404</div>
          <div className="mt-2 text-xl font-semibold text-gray-800 dark:text-gray-100">Page not found</div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">The page you are looking for doesnt exist or has been moved.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            Go Back
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
