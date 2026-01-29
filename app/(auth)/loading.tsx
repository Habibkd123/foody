import { Loader2, Lock } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                        <Lock className="w-12 h-12 text-orange-600" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-32 h-32 text-orange-500 animate-spin opacity-50" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Authenticating...</h2>
                <p className="text-gray-600">Please wait while we verify your credentials</p>
                <div className="mt-6">
                    <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
