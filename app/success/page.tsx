"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-4">Your session ID is: {sessionId}</p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go Home
      </a>
    </div>
  );
}
