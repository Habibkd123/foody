import { Loader2, Shield } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-32 h-32 text-blue-500 animate-spin opacity-50" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Admin Panel...</h2>
                <p className="text-gray-600">Preparing your dashboard</p>
                <div className="mt-6 flex justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
            </div>
        </div>
    );
}
