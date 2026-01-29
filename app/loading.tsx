import { Loader2, ShoppingBag } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-orange-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-40 h-40 text-orange-500 animate-spin opacity-30" />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gro-Delivery</h2>
          <p className="text-gray-600">Loading your delicious experience...</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>

        <div className="max-w-xs mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
