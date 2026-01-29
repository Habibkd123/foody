import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6">
                        <Loader2 className="w-full h-full text-orange-500 animate-spin" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 mx-auto">
                        <div className="w-full h-full rounded-full border-4 border-orange-200 border-t-transparent animate-spin"></div>
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
                <p className="text-gray-600">Please wait while we prepare your content</p>
            </div>
        </div>
    );
}
