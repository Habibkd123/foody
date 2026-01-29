"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200">
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Admin Panel Error
                    </h1>
                    <p className="text-gray-600 mb-4">
                        An error occurred in the admin panel. Please try again or contact support if the issue persists.
                    </p>
                    {error.message && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-red-800 font-mono break-words">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-red-600 mt-2">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                    <Link
                        href="/admin"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
