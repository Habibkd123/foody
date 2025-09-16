"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WishListContext } from "@/context/WishListsContext";
import { Trash2 } from "lucide-react";
import AddressModal from "./AddressModal";
import { useAuthStorage } from "@/hooks/useAuth";

type UserShape = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
};

function safeParse<T = unknown>(raw: string | null): T | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Value is corrupted; clean it so it won’t keep crashing future loads
    if (typeof window !== "undefined") {
      localStorage.removeItem("G-user");
    }
    return null;
  }
}

const Profile = () => {
  const { wishListsData, setWistListsData } = React.useContext<any>(WishListContext);
  const [addressOpen, setAddressOpen] = useState(false);
const {user,setUser}=useAuthStorage()
  const handleRemove = (id: number) => {
    setWistListsData(wishListsData.filter((item: any) => item.id !== id));
  };



  const handleLogout = () => {
    setUser(null);
    window.location.reload();
  };

  const firstInitial = (user?.firstName?.[0] || "U").toUpperCase();
  const lastInitial = (user?.lastName?.[0] || "").toUpperCase();

  return (
    <section id="profile" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Your Profile
        </h2>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <Avatar className="w-20 h-20">
                      {user?.image ? (
                        <AvatarImage
                          src={user?.image}
                          alt={user?.firstName || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-orange-500 text-white font-bold">
                          {firstInitial}
                          {lastInitial ? ` ${lastInitial}` : ""}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {(user?.firstName || "") +
                          (user?.lastName ? ` ${user.lastName}` : "") ||
                          "Guest"}
                      </h3>
                      {user?.email && (
                        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                      )}
                      {user?.phone && (
                        <p className="text-gray-600 dark:text-gray-400">{user.phone}</p>
                      )}
                    </div>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 me-2">
                    Edit Profile
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <Card key={order}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Order #{order}001
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Spice Garden • 2 items
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Dec {20 + order}, 2024
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ₹{320 + order * 50}
                          </p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            Reorder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              {!wishListsData || wishListsData.length === 0 ? (
                <p className="text-gray-600 text-center">Your wishlist is empty 😢</p>
              ) : (
                // ✅ one grid, items inside (not a grid per item)
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishListsData.map((item: any) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-orange-500 font-semibold">₹{item.price}</p>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Home</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          123 Main Street, City, State 12345
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Button onClick={() => setAddressOpen(true)} className="w-full bg-orange-500 hover:bg-orange-600">
                  Add New Address
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
         {addressOpen && (
        <AddressModal addressOpen={addressOpen} setAddressOpen={setAddressOpen} />
      )}
    </section>
  );
};

export default Profile;
