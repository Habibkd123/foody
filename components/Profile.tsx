"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WishListContext } from "@/context/WishListsContext";
import { Trash2 } from "lucide-react";
import { useAuthStorage } from "@/hooks/useAuth";
import { getUserOrders } from "./APICall/order";
import { useCartOrder } from "@/context/OrderContext";
import { Address } from "@/types/global";
import DeliveryAddressPage from "./AddAddressModal";

const Profile = () => {
  const {
    address,
    setDistance,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    loading
  } = useCartOrder();
  
  const { wishListsData, setWistListsData } = React.useContext<any>(WishListContext);
  const { user, setUser } = useAuthStorage();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Update addresses when context address changes
  useEffect(() => {
    if (address) {
      if (Array.isArray(address)) {
        setAddresses(address);
      } else {
        // If address is a single object, wrap it in an array
        setAddresses([address]);
      }
    }
  }, [address]);

  // Load addresses when component mounts
  useEffect(() => {
    if (user?._id) {
      handleGetAllAddress();
    }
  }, [user?._id]);

  // Load orders when component mounts
  useEffect(() => {
    if (user?._id) {
      handleUserOrders();
    }
  }, [user?._id]);

  const handleGetAllAddress = async () => {
    try {
      await getAddresses(user._id);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleUserOrders = async () => {
    try {
      if (!user?._id) return;

      let response = await getUserOrders(user._id);
      console.log("response", response);

      if (response?.success) {
        setOrders(response.data);
      } else {
        alert(response?.error || JSON.stringify(response));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRemove = (id: number) => {
    setWistListsData(wishListsData.filter((item: any) => item.id !== id));
  };

  const handleLogout = () => {
    setUser(null);
    window.location.reload();
  };

  const handleAddAddress = async (newAddress: Address) => {
    try {
      await addAddress(user._id, newAddress);
      setShowAddModal(false);
      setEditingAddress(null);
      // Refresh addresses list
      await handleGetAllAddress();
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  };

  const handleEditAddress = (adrs: Address) => {
    setEditingAddress(adrs);
    setShowAddModal(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(user?._id, addressId);
        // Refresh addresses list
        await handleGetAllAddress();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again.');
      }
    }
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
                {Array.isArray(orders) && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <Card key={order._id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Order #{order.orderId || order._id.slice(-6)}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {order.items?.length || 0} items
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-sm mt-1">
                              <span className={`px-2 py-1 rounded text-xs ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ₹{order.total?.toFixed(2) || 0}
                            </p>
                            <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No orders yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              {!wishListsData || wishListsData.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your wishlist is empty 😢</p>
              ) : (
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
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm mt-2"
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
                {Array.isArray(addresses) && addresses.length > 0 ? (
                  <>
                    {addresses.map((adrs: any) => (
                      <Card key={adrs._id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {adrs.label || 'Address'}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {adrs.street && `${adrs.street}, `}
                                {adrs.area && `${adrs.area}, `}
                                {adrs.city && `${adrs.city}, `}
                                {adrs.state && `${adrs.state} `}
                                {adrs.zipCode && adrs.zipCode}
                              </p>
                              {adrs.landmark && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Landmark: {adrs.landmark}
                                </p>
                              )}
                              {adrs.name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Name: {adrs.name}
                                </p>
                              )}
                              {adrs.phone && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Phone: {adrs.phone}
                                </p>
                              )}
                              {adrs.isDefault && (
                                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditAddress(adrs)}
                                disabled={loading}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteAddress(adrs._id)}
                                disabled={loading}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddModal(true);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={loading}
                    >
                      Add New Address
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 text-center py-8">No addresses saved</p>
                    <Button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddModal(true);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={loading}
                    >
                      Add New Address
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showAddModal && (
        <DeliveryAddressPage
          open={showAddModal}
          userId={user?._id}
          onClose={() => {
            setShowAddModal(false);
            setEditingAddress(null);
          }}
          setShowAddModal={setShowAddModal}
          handleAddAddress={handleAddAddress}
          editingAddress={editingAddress || undefined}
        />
      )}
    </section>
  );
};

export default Profile;