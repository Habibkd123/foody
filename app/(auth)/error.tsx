"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, LogIn } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Auth error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Authentication Error
                    </h1>
                    <p className="text-gray-600 mb-4">
                        We couldn't complete your authentication request. Please try again.
                    </p>
                    {error.message && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-orange-800 font-mono break-words">
                                {error.message}
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                    <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <LogIn className="w-5 h-5" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
