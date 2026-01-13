"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { WishListContext } from "@/context/WishListsContext";
import { Trash2, Package, Heart, MapPin, User, Edit, LogOut, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useAuthStorage } from "@/hooks/useAuth";
import { getUserOrders } from "./APICall/order";
import { useCartOrder } from "@/context/OrderContext";
import { Address } from "@/types/global";
import DeliveryAddressPage from "./AddAddressModal";
import EditProfileModal from "./EditProfileModal";
import { useSearchParams } from "next/navigation";
import RaiseDisputeModal from "./RaiseDisputeModal";
import DisputeDetailsModal from "./DisputeDetailsModal";

const Profile = () => {
  const searchParams = useSearchParams();
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
  const { user, setUser, updateUser, logout } = useAuthStorage();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState<string>('profile');
  const [raiseDisputeOpen, setRaiseDisputeOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [disputesLoading, setDisputesLoading] = useState(false);
  const [disputeDetailsOpen, setDisputeDetailsOpen] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

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
      setIsLoading(true);
      handleGetAllAddress();
    }
  }, [user?._id]);

  // Load orders when component mounts
  useEffect(() => {
    if (user?._id) {
      handleUserOrders();
    }
  }, [user?._id]);

  // Sync tab from query param (?tab=orders)
  useEffect(() => {
    const t = searchParams?.get('tab');
    if (t === 'orders' || t === 'favorites' || t === 'addresses' || t === 'profile' || t === 'disputes') {
      setTabValue(t);
    }
  }, [searchParams]);

  // Set loading to false when data is loaded
  useEffect(() => {
    if (orders || addresses || wishListsData) {
      setIsLoading(false);
    }
  }, [orders, addresses, wishListsData]);

  const handleGetAllAddress = async () => {
    try {
      await getAddresses(user?._id);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleUserDisputes = async () => {
    try {
      setDisputesLoading(true);
      const res = await fetch('/api/disputes', { method: 'GET' });
      const json = await res.json();
      if (res.ok && json?.success) {
        setDisputes(Array.isArray(json.data) ? json.data : []);
      } else {
        alert(json?.error || 'Failed to fetch disputes');
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to fetch disputes');
    } finally {
      setDisputesLoading(false);
    }
  };

  const openDisputeDetails = (id: string) => {
    setSelectedDisputeId(id);
    setDisputeDetailsOpen(true);
  };

  const openRaiseDispute = (order: any) => {
    setSelectedOrder(order);
    setRaiseDisputeOpen(true);
  };

  const handleUserOrders = async () => {
    try {
      if (!user?._id) return;

      let response = await getUserOrders(user?._id);
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
    logout();
    window.location.reload();
  };

  const handleAddAddress = async (newAddress: Address) => {
    try {
      await addAddress(user?._id, newAddress);
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
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Modern Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                {user?.image ? (
                  <AvatarImage src={user?.image} alt={user?.firstName || "User"} />
                ) : (
                  <AvatarFallback className="bg-white text-orange-500 text-2xl font-bold">
                    {firstInitial}{lastInitial ? ` ${lastInitial}` : ""}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {(user?.firstName || "") + (user?.lastName ? ` ${user?.lastName}` : "") || "Guest"}
              </h1>
              <p className="text-orange-100 mb-1">{user?.email}</p>
              {user?.phone && (
                <p className="text-orange-100">{user?.phone}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <User className="w-3 h-3 mr-1" />
                  Premium Member
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-lg"
                onClick={() => setEditProfileModal(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-dark hover:bg-white hover:text-orange-600 font-semibold"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{orders?.length || 0}</p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                      <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Favorites</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{wishListsData?.length || 0}</p>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                      <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Addresses</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{addresses?.length || 0}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        {/* Modern Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <Package className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="disputes" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
                onClick={() => {
                  if (!disputes || disputes.length === 0) {
                    handleUserDisputes();
                  }
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                Disputes
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <Heart className="w-4 h-4 mr-2" />
                Favorites
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Addresses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {(user?.firstName || "") + (user?.lastName ? ` ${user?.lastName}` : "") || "Guest"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{user?.email || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{user?.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</label>
                      <div className="mt-1">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex justify-end space-x-3">
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => setEditProfileModal(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                  </div>
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
                                order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </p>
                            {/* Tracking Steps */}
                            <div className="mt-3">
                              {(() => {
                                const steps = ['placed','processing','out_for_delivery','completed'];
                                const status = String(order.status || '').toLowerCase();
                                const idx = Math.max(0, steps.indexOf(steps.includes(status) ? status : 'processing'));
                                return (
                                  <div className="flex items-center gap-2">
                                    {steps.map((s, i) => (
                                      <div key={s} className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${i <= idx ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                        {i < steps.length - 1 && (
                                          <div className={`h-0.5 w-10 ${i < idx ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ₹{order.total?.toFixed(2) || 0}
                            </p>
                            <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                              onClick={() => openRaiseDispute(order)}
                            >
                              Raise Dispute
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

            <RaiseDisputeModal
              open={raiseDisputeOpen}
              onOpenChange={setRaiseDisputeOpen}
              order={selectedOrder}
              onCreated={() => {
                handleUserOrders();
                handleUserDisputes();
              }}
            />

            <DisputeDetailsModal
              open={disputeDetailsOpen}
              onOpenChange={setDisputeDetailsOpen}
              disputeId={selectedDisputeId}
            />

            <TabsContent value="disputes" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">My Disputes</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={handleUserDisputes}
                  disabled={disputesLoading}
                >
                  {disputesLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              {disputesLoading ? (
                <p className="text-gray-600 text-center py-8">Loading disputes...</p>
              ) : Array.isArray(disputes) && disputes.length > 0 ? (
                <div className="space-y-4">
                  {disputes.map((d: any) => (
                    <Card key={d._id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Order #{d?.order?.orderId || (d?.order?._id ? String(d.order._id).slice(-6) : (d?._id ? String(d._id).slice(-6) : ''))}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">{String(d.reason || '')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                {String(d.status || '')}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              onClick={() => openDisputeDetails(String(d._id))}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No disputes yet</p>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              {!wishListsData || wishListsData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-red-100 dark:bg-red-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-red-500 dark:text-red-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">Your wishlist is empty</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Start adding items you love!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishListsData.map((item: any) => (
                    <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">₹{item.price}</p>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            Add to Cart
                          </Button>
                        </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((adrs: any) => (
                        <Card key={adrs._id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {adrs.label || 'Home Address'}
                                </h4>
                                {adrs.isDefault && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Default
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <p className="text-gray-700 dark:text-gray-300">
                                {adrs.street && `${adrs.street},`}
                                {adrs.area && ` ${adrs.area},`}
                                {adrs.city && ` ${adrs.city},`}
                                {adrs.state && ` ${adrs.state}`}
                                {adrs.zipCode && ` ${adrs.zipCode}`}
                              </p>
                              {adrs.landmark && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  📍 {adrs.landmark}
                                </p>
                              )}
                              {adrs.name && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  👤 {adrs.name}
                                </p>
                              )}
                              {adrs.phone && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  📞 {adrs.phone}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditAddress(adrs)}
                                disabled={loading}
                                className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              {!adrs.isDefault && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                                  onClick={() => handleDeleteAddress(adrs._id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddModal(true);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 font-semibold"
                      disabled={loading}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Add New Address
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center py-12">
                      <div className="bg-blue-100 dark:bg-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">No addresses saved</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">Add your first delivery address</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddModal(true);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 font-semibold"
                      disabled={loading}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Add Your First Address
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
      
      <EditProfileModal
        open={editProfileModal}
        onClose={() => setEditProfileModal(false)}
        user={user}
        setUser={setUser}
      />
    </section>
  );
};

export default Profile;