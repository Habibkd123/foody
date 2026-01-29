"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("User routing error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-gray-600 mb-4">
                        We encountered an error while loading this page. Don't worry, your data is safe.
                    </p>
                    {error.message && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700 font-mono break-words">
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
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
