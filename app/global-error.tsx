"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
                    <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="mb-6">
                            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <AlertTriangle className="w-12 h-12 text-red-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Something Went Wrong
                            </h1>
                            <p className="text-gray-600 mb-4">
                                We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
                            </p>
                            {error.message && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
                                    <p className="text-xs font-semibold text-red-800 mb-1">Error Details:</p>
                                    <p className="text-sm text-red-700 font-mono break-words">
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
                                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                Go to Homepage
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Support
                            </Link>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                If this problem persists, please contact our support team with the error ID above.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
