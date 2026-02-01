// "use client";
// import React, { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Trash2, Package, Heart, MapPin, User, Edit, LogOut, TrendingUp, Clock, CheckCircle, Star } from "lucide-react";
// import { useUserStore } from "@/lib/store/useUserStore";
// import { useAddressQuery } from "@/hooks/useAddressQuery";
// import { useWishlistQuery } from "@/hooks/useWishlistQuery";
// import { useOrdersQuery } from "@/hooks/useOrdersQuery";
// import { Address } from "@/types/global";
// import { useSearchParams } from "next/navigation";
// import dynamic from "next/dynamic";

// const DeliveryAddressPage = dynamic(() => import("./AddAddressModal"), { ssr: false });
// const EditProfileModal = dynamic(() => import("./EditProfileModal"), { ssr: false });
// const RaiseDisputeModal = dynamic(() => import("./RaiseDisputeModal"), { ssr: false });
// const DisputeDetailsModal = dynamic(() => import("./DisputeDetailsModal"), { ssr: false });

// const Profile = () => {
//   const searchParams = useSearchParams();
//   const { user, logout, setUser } = useUserStore();

//   const {
//     addresses,
//     isLoading: isAddressesLoading,
//     addAddress,
//     updateAddress,
//     deleteAddress
//   } = useAddressQuery(user?._id);

//   const {
//     data: wishListsData = [],
//     removeFromWishlist,
//     isLoading: isWishlistLoading
//   } = useWishlistQuery(user?._id);

//   const {
//     data: orders = [],
//     isLoading: isOrdersLoading
//   } = useOrdersQuery(user?._id);

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingAddress, setEditingAddress] = useState<Address | null>(null);
//   const [editProfileModal, setEditProfileModal] = useState(false);
//   const [tabValue, setTabValue] = useState<string>('profile');
//   const [raiseDisputeOpen, setRaiseDisputeOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [disputes, setDisputes] = useState<any[]>([]);
//   const [disputesLoading, setDisputesLoading] = useState(false);
//   const [disputeDetailsOpen, setDisputeDetailsOpen] = useState(false);
//   const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

//   // Sync tab from query param (?tab=orders)
//   useEffect(() => {
//     const t = searchParams?.get('tab');
//     if (t === 'orders' || t === 'favorites' || t === 'addresses' || t === 'profile' || t === 'disputes') {
//       setTabValue(t);
//     }
//   }, [searchParams]);

//   const handleUserDisputes = async () => {
//     try {
//       setDisputesLoading(true);
//       const res = await fetch('/api/disputes', { method: 'GET' });
//       const json = await res.json();
//       if (res.ok && json?.success) {
//         setDisputes(Array.isArray(json.data) ? json.data : []);
//       } else {
//         alert(json?.error || 'Failed to fetch disputes');
//       }
//     } catch (e: any) {
//       alert(e?.message || 'Failed to fetch disputes');
//     } finally {
//       setDisputesLoading(false);
//     }
//   };

//   const openDisputeDetails = (id: string) => {
//     setSelectedDisputeId(id);
//     setDisputeDetailsOpen(true);
//   };

//   const openRaiseDispute = (order: any) => {
//     setSelectedOrder(order);
//     setRaiseDisputeOpen(true);
//   };

//   const handleRemoveWishlist = async (productId: string) => {
//     if (!user?._id) return;
//     try {
//       await removeFromWishlist({ userId: user._id, productId });
//     } catch (error) {
//       console.error('Error removing from wishlist:', error);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     window.location.href = '/';
//   };

//   const handleSaveAddress = async (newAddress: Address) => {
//     try {
//       if (editingAddress) {
//         const addressId = editingAddress._id;
//         if (!addressId) throw new Error("Address ID not found");
//         await updateAddress({ addressId, updates: newAddress });
//       } else {
//         await addAddress(newAddress);
//       }
//       setShowAddModal(false);
//       setEditingAddress(null);
//     } catch (error) {
//       console.error('Error saving address:', error);
//       throw error;
//     }
//   };

//   const handleEditAddress = (adrs: Address) => {
//     setEditingAddress(adrs);
//     setShowAddModal(true);
//   };

//   const handleDeleteAddress = async (addressId: string) => {
//     if (window.confirm('Are you sure you want to delete this address?')) {
//       try {
//         await deleteAddress(addressId);
//       } catch (error) {
//         console.error('Error deleting address:', error);
//         alert('Failed to delete address. Please try again.');
//       }
//     }
//   };

//   const firstInitial = (user?.firstName?.[0] || "U").toUpperCase();
//   const lastInitial = (user?.lastName?.[0] || "").toUpperCase();
//   const isLoading = isAddressesLoading || isWishlistLoading || isOrdersLoading;

//   return (
//     <section className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-orange-50 md:via-white md:to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 md:pb-8">
//       <div className="container mx-auto px-0 md:px-4 py-0 md:py-8">
//         {/* Modern Profile Header */}
//         <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-b-[2rem] md:rounded-3xl p-6 pt-20 md:pt-8 md:p-8 mb-6 md:mb-8 shadow-lg md:shadow-2xl">
//           <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
//             <div className="relative">
//               <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-white shadow-xl">
//                 {user?.image ? (
//                   <AvatarImage src={user?.image} alt={user?.firstName || "User"} />
//                 ) : (
//                   <AvatarFallback className="bg-white text-orange-500 text-2xl font-bold">
//                     {firstInitial}{lastInitial ? ` ${lastInitial}` : ""}
//                   </AvatarFallback>
//                 )}
//               </Avatar>
//               <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-white">
//                 <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
//               </div>
//             </div>

//             <div className="flex-1 text-center md:text-left">
//               <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">
//                 {(user?.firstName || "") + (user?.lastName ? ` ${user?.lastName}` : "") || "Guest"}
//               </h1>
//               <p className="text-orange-100 text-sm md:text-base mb-1">{user?.email}</p>
//               {user?.phone && (
//                 <p className="text-orange-100 text-sm md:text-base">{user?.phone}</p>
//               )}
//               <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
//                 <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs">
//                   <User className="w-3 h-3 mr-1" />
//                   Premium
//                 </Badge>
//                 <Badge className="bg-yellow-400 text-gray-900 border-none text-xs">
//                   <Star className="w-3 h-3 mr-1 fill-current" />
//                   {user?.loyaltyPoints || 0} Pts
//                 </Badge>
//               </div>
//             </div>

//             <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto justify-center">
//               <Button
//                 size="sm"
//                 className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-lg flex-1 md:flex-none"
//                 onClick={() => setEditProfileModal(true)}
//               >
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold flex-1 md:flex-none bg-transparent"
//                 onClick={handleLogout}
//               >
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards - Mobile Row */}
//         <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8 px-4 md:px-0">
//           {isLoading ? (
//             <>
//               <Skeleton className="h-20 rounded-xl" />
//               <Skeleton className="h-20 rounded-xl" />
//               <Skeleton className="h-20 rounded-xl" />
//             </>
//           ) : (
//             <>
//               <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm md:shadow-md bg-white">
//                 <CardContent className="p-3 md:p-6 flex flex-col items-center justify-center text-center h-full">
//                   <div className="bg-orange-100 dark:bg-orange-900 p-2 md:p-3 rounded-full mb-2">
//                     <Package className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" />
//                   </div>
//                   <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">{orders?.length || 0}</p>
//                   <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Orders</p>
//                 </CardContent>
//               </Card>

//               <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm md:shadow-md bg-white">
//                 <CardContent className="p-3 md:p-6 flex flex-col items-center justify-center text-center h-full">
//                   <div className="bg-red-100 dark:bg-red-900 p-2 md:p-3 rounded-full mb-2">
//                     <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
//                   </div>
//                   <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">{wishListsData?.length || 0}</p>
//                   <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Favorites</p>
//                 </CardContent>
//               </Card>

//               <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm md:shadow-md bg-white">
//                 <CardContent className="p-3 md:p-6 flex flex-col items-center justify-center text-center h-full">
//                   <div className="bg-blue-100 dark:bg-blue-900 p-2 md:p-3 rounded-full mb-2">
//                     <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">{addresses?.length || 0}</p>
//                   <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Saved</p>
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </div>

//         {/* Modern Tabs */}
//         <div className="bg-transparent md:bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-xl p-0 md:p-6">
//           <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
//             <div className="px-4 md:px-0 sticky top-0 z-10 bg-gray-50 md:bg-transparent pb-2 pt-1">
//               <TabsList className="flex w-full overflow-x-auto md:grid md:grid-cols-5 mb-0 md:mb-8 bg-white md:bg-gray-100 dark:bg-gray-700 p-1 rounded-xl no-scrollbar gap-2 md:gap-0 shadow-sm md:shadow-none border md:border-none">

//                 <TabsTrigger
//                   value="profile"
//                   className="min-w-[100px] flex-shrink-0 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
//                 >
//                   <User className="w-4 h-4 mr-2" />
//                   Profile
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="orders"
//                   className="min-w-[100px] flex-shrink-0 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
//                 >
//                   <Package className="w-4 h-4 mr-2" />
//                   Orders
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="disputes"
//                   className="min-w-[100px] flex-shrink-0 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
//                   onClick={() => {
//                     if (!disputes || disputes.length === 0) {
//                       handleUserDisputes();
//                     }
//                   }}
//                 >
//                   <Clock className="w-4 h-4 mr-2" />
//                   Disputes
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="favorites"
//                   className="min-w-[100px] flex-shrink-0 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
//                 >
//                   <Heart className="w-4 h-4 mr-2" />
//                   Favorites
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="addresses"
//                   className="min-w-[100px] flex-shrink-0 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
//                 >
//                   <MapPin className="w-4 h-4 mr-2" />
//                   Addresses
//                 </TabsTrigger>
//               </TabsList>
//             </div>

//             <TabsContent value="profile" className="mt-6">
//               <Card className="border-0 shadow-md">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <User className="w-5 h-5" />
//                     Profile Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
//                       <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
//                         {(user?.firstName || "") + (user?.lastName ? ` ${user?.lastName}` : "") || "Guest"}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
//                       <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{user?.email || "Not provided"}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
//                       <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{user?.phone || "Not provided"}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</label>
//                       <div className="mt-1">
//                         <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
//                           <CheckCircle className="w-3 h-3 mr-1" />
//                           Verified
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <Separator className="my-6" />
//                   <div className="flex justify-end space-x-3">
//                     <Button
//                       className="bg-orange-500 hover:bg-orange-600"
//                       onClick={() => setEditProfileModal(true)}
//                     >
//                       <Edit className="w-4 h-4 mr-2" />
//                       Update Profile
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="orders" className="mt-6">
//               <div className="space-y-4">
//                 {Array.isArray(orders) && orders.length > 0 ? (
//                   orders.map((order: any) => (
//                     <Card key={order._id}>
//                       <CardContent className="p-6">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-semibold text-gray-900 dark:text-white">
//                               Order #{order.orderId || order._id.slice(-6)}
//                             </h4>
//                             <p className="text-gray-600 dark:text-gray-400">
//                               {order.items?.length || 0} items
//                             </p>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">
//                               {new Date(order.createdAt).toLocaleDateString('en-US', {
//                                 month: 'short',
//                                 day: 'numeric',
//                                 year: 'numeric'
//                               })}
//                             </p>
//                             <p className="text-sm mt-1">
//                               <span className={`px-2 py-1 rounded text-xs ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                 order.status === 'completed' ? 'bg-green-100 text-green-800' :
//                                   order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
//                                     order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
//                                       order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                                         'bg-gray-100 text-gray-800'
//                                 }`}>
//                                 {order.status}
//                               </span>
//                             </p>
//                             {/* Tracking Steps */}
//                             <div className="mt-3">
//                               {(() => {
//                                 const steps = ['placed', 'processing', 'out_for_delivery', 'completed'];
//                                 const status = String(order.status || '').toLowerCase();
//                                 const idx = Math.max(0, steps.indexOf(steps.includes(status) ? status : 'processing'));
//                                 return (
//                                   <div className="flex items-center gap-2">
//                                     {steps.map((s, i) => (
//                                       <div key={s} className="flex items-center gap-2">
//                                         <div className={`w-2.5 h-2.5 rounded-full ${i <= idx ? 'bg-emerald-500' : 'bg-gray-300'}`} />
//                                         {i < steps.length - 1 && (
//                                           <div className={`h-0.5 w-10 ${i < idx ? 'bg-emerald-500' : 'bg-gray-300'}`} />
//                                         )}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 );
//                               })()}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-semibold text-gray-900 dark:text-white">
//                               ₹{order.total?.toFixed(2) || 0}
//                             </p>
//                             <Button size="sm" variant="outline" className="mt-2 bg-transparent">
//                               View Details
//                             </Button>
//                             <Button
//                               size="sm"
//                               className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
//                               onClick={() => openRaiseDispute(order)}
//                             >
//                               Raise Dispute
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   <p className="text-gray-600 text-center py-8">No orders yet</p>
//                 )}
//               </div>
//             </TabsContent>

//             <RaiseDisputeModal
//               open={raiseDisputeOpen}
//               onOpenChange={setRaiseDisputeOpen}
//               order={selectedOrder}
//               onCreated={() => {
//                 handleUserDisputes();
//               }}
//             />

//             <DisputeDetailsModal
//               open={disputeDetailsOpen}
//               onOpenChange={setDisputeDetailsOpen}
//               disputeId={selectedDisputeId}
//             />

//             <TabsContent value="disputes" className="mt-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="text-lg font-semibold">My Disputes</div>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="bg-transparent"
//                   onClick={handleUserDisputes}
//                   disabled={disputesLoading}
//                 >
//                   {disputesLoading ? 'Refreshing...' : 'Refresh'}
//                 </Button>
//               </div>

//               {disputesLoading ? (
//                 <p className="text-gray-600 text-center py-8">Loading disputes...</p>
//               ) : Array.isArray(disputes) && disputes.length > 0 ? (
//                 <div className="space-y-4">
//                   {disputes.map((d: any) => (
//                     <Card key={d._id}>
//                       <CardContent className="p-6">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-semibold text-gray-900 dark:text-white">
//                               Order #{d?.order?.orderId || (d?.order?._id ? String(d.order._id).slice(-6) : (d?._id ? String(d._id).slice(-6) : ''))}
//                             </h4>
//                             <p className="text-gray-600 dark:text-gray-400">{String(d.reason || '')}</p>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">
//                               {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
//                             </p>
//                             <p className="text-sm mt-1">
//                               <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
//                                 {String(d.status || '')}
//                               </span>
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               className="bg-transparent"
//                               onClick={() => openDisputeDetails(String(d._id))}
//                             >
//                               View
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-600 text-center py-8">No disputes yet</p>
//               )}
//             </TabsContent>

//             <TabsContent value="favorites" className="mt-6">
//               {!wishListsData || wishListsData.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="bg-red-100 dark:bg-red-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Heart className="w-10 h-10 text-red-500 dark:text-red-400" />
//                   </div>
//                   <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">Your wishlist is empty</p>
//                   <p className="text-gray-500 dark:text-gray-500 text-sm">Start adding items you love!</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {wishListsData.map((item: any) => (
//                     <Card key={item._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
//                       <div className="relative">
//                         <img
//                           src={item.images?.[0] || "/placeholder.svg"}
//                           alt={item.name}
//                           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                         <button
//                           onClick={() => handleRemoveWishlist(item._id)}
//                           className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50 hover:text-red-500"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <CardContent className="p-4">
//                         <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
//                           {item.name}
//                         </h4>
//                         <div className="flex items-center justify-between">
//                           <p className="text-xl font-bold text-orange-600 dark:text-orange-400">₹{item.price}</p>
//                           <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
//                             View Product
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>

//             <TabsContent value="addresses" className="mt-6">
//               <div className="space-y-4">
//                 {Array.isArray(addresses) && addresses.length > 0 ? (
//                   <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {addresses.map((adrs: any) => (
//                         <Card key={adrs._id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
//                           <CardContent className="p-6">
//                             <div className="flex justify-between items-start mb-4">
//                               <div className="flex items-center gap-2">
//                                 <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
//                                   <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                                 </div>
//                                 <h4 className="font-semibold text-gray-900 dark:text-white">
//                                   {adrs.label || 'Home Address'}
//                                 </h4>
//                                 {adrs.isDefault && (
//                                   <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
//                                     Default
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="space-y-2 mb-4">
//                               <p className="text-gray-700 dark:text-gray-300">
//                                 {adrs.street && `${adrs.street},`}
//                                 {adrs.area && ` ${adrs.area},`}
//                                 {adrs.city && ` ${adrs.city},`}
//                                 {adrs.state && ` ${adrs.state}`}
//                                 {adrs.zipCode && ` ${adrs.zipCode}`}
//                               </p>
//                               {adrs.landmark && (
//                                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                                   📍 {adrs.landmark}
//                                 </p>
//                               )}
//                               {adrs.name && (
//                                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                                   👤 {adrs.name}
//                                 </p>
//                               )}
//                               {adrs.phone && (
//                                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                                   📞 {adrs.phone}
//                                 </p>
//                               )}
//                             </div>
//                             <div className="flex gap-2">
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() => handleEditAddress(adrs)}
//                                 disabled={isLoading}
//                                 className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
//                               >
//                                 <Edit className="w-4 h-4 mr-1" />
//                                 Edit
//                               </Button>
//                               {!adrs.isDefault && (
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
//                                   onClick={() => handleDeleteAddress(adrs._id)}
//                                   disabled={isLoading}
//                                 >
//                                   <Trash2 className="w-4 h-4 mr-1" />
//                                   Delete
//                                 </Button>
//                               )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                     <Button
//                       onClick={() => {
//                         setEditingAddress(null);
//                         setShowAddModal(true);
//                       }}
//                       className="w-full bg-orange-500 hover:bg-orange-600 font-semibold"
//                       disabled={isLoading}
//                     >
//                       <MapPin className="w-4 h-4 mr-2" />
//                       Add New Address
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-center py-12">
//                       <div className="bg-blue-100 dark:bg-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <MapPin className="w-10 h-10 text-blue-500 dark:text-blue-400" />
//                       </div>
//                       <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">No addresses saved</p>
//                       <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">Add your first delivery address</p>
//                     </div>
//                     <Button
//                       onClick={() => {
//                         setEditingAddress(null);
//                         setShowAddModal(true);
//                       }}
//                       className="w-full bg-orange-500 hover:bg-orange-600 font-semibold"
//                       disabled={isLoading}
//                     >
//                       <MapPin className="w-4 h-4 mr-2" />
//                       Add Your First Address
//                     </Button>
//                   </>
//                 )}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>

//       {showAddModal && (
//         <DeliveryAddressPage
//           open={showAddModal}
//           userId={user?._id}
//           onClose={() => {
//             setShowAddModal(false);
//             setEditingAddress(null);
//           }}
//           setShowAddModal={setShowAddModal}
//           handleAddAddress={handleSaveAddress}
//           editingAddress={editingAddress || undefined}
//         />
//       )}

//       <EditProfileModal
//         open={editProfileModal}
//         onClose={() => setEditProfileModal(false)}
//       />
//     </section>
//   );
// };

// export default Profile;



"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  Edit,
  LogOut,
  Star,
  Clock,
  CheckCircle,
  Trash2
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAddressQuery } from "@/hooks/useAddressQuery";
import { useWishlistQuery } from "@/hooks/useWishlistQuery";
import { useOrdersQuery } from "@/hooks/useOrdersQuery";
import { Address } from "@/types/global";
/* dynamic modals */
const AddAddressModal = dynamic(() => import("./AddAddressModal"), { ssr: false });
const EditProfileModal = dynamic(() => import("./EditProfileModal"), { ssr: false });
const RaiseDisputeModal = dynamic(() => import("./RaiseDisputeModal"), { ssr: false });
const DisputeDetailsModal = dynamic(() => import("./DisputeDetailsModal"), { ssr: false });
const ProfileInfo = ({ user }: { user: any }) => {
  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" />
          Profile Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="text-lg font-semibold">
              {user?.firstName || "—"} {user?.lastName || ""}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">
              {user?.email || "Not provided"}
            </p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="text-lg font-semibold">
              {user?.phone || "Not provided"}
            </p>
          </div>

          {/* Account Status */}
          <div>
            <p className="text-sm text-muted-foreground">Account Status</p>
            <Badge className="mt-1 bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Extra Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-semibold capitalize">
              {user?.role || "user"}
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Joined On</p>
            <p className="font-semibold">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Loyalty Points</p>
            <p className="font-semibold">
              ⭐ {user?.loyaltyPoints || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const OrdersList = ({ orders = [] }: { orders: any[] }) => {
  if (!orders.length) {
    return (
      <p className="text-center text-gray-500 py-8">
        No orders yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id} className="shadow-sm">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                Order #{order.orderId || order._id.slice(-6)}
              </h4>
              <p className="text-sm text-gray-500">
                {order.items?.length || 0} items
              </p>
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">₹{order.total}</p>
              <Button size="sm" variant="outline" className="mt-2">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


const WishlistGrid = ({
  items = [],
  onRemove,
}: {
  items: any[];
  onRemove: (id: string) => void;
}) => {
  if (!items.length) {
    return (
      <div className="text-center py-10">
        <Heart className="w-10 h-10 mx-auto text-red-400 mb-3" />
        <p className="text-gray-500">Wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <Card key={item._id} className="shadow-md overflow-hidden">
          <img
            src={item.images?.[0] || "/placeholder.svg"}
            className="h-40 w-full object-cover"
            alt={item.name}
          />

          <CardContent className="p-4">
            <h4 className="font-semibold line-clamp-2">{item.name}</h4>
            <p className="text-orange-600 font-bold mt-1">
              ₹{item.price}
            </p>

            <div className="flex justify-between mt-3">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRemove(item._id)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};



const AddressList = ({
  addresses = [],
  onAdd,
  onEdit,
  onDelete,
}: {
  addresses: any[];
  onAdd: () => void;
  onEdit: (a: any) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No saved addresses
        </p>
      ) : (
        addresses.map((a) => (
          <Card key={a._id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {a.label || "Address"}
                    {a.isDefault && (
                      <Badge className="ml-2 bg-green-100 text-green-700">
                        Default
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {a.street}, {a.city}, {a.state}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(a)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                    onClick={() => onDelete(a._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Button onClick={onAdd} className="w-full bg-orange-500 hover:bg-orange-600">
        Add New Address
      </Button>
    </div>
  );
};



// const AddAddressModal = ({
//   open,
//   editingAddress,
//   handleAddAddress,
//   onClose,
// }: any) => {
//   const [street, setStreet] = useState(editingAddress?.street || "");
//   const [city, setCity] = useState(editingAddress?.city || "");
//   const [state, setState] = useState(editingAddress?.state || "");

//   const save = () => {
//     handleAddAddress({
//       ...editingAddress,
//       street,
//       city,
//       state,
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-md w-full">
//         <DialogHeader>
//           <DialogTitle>
//             {editingAddress ? "Edit Address" : "Add Address"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <input
//             className="w-full border rounded px-3 py-2"
//             placeholder="Street"
//             value={street}
//             onChange={(e) => setStreet(e.target.value)}
//           />
//           <input
//             className="w-full border rounded px-3 py-2"
//             placeholder="City"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//           />
//           <input
//             className="w-full border rounded px-3 py-2"
//             placeholder="State"
//             value={state}
//             onChange={(e) => setState(e.target.value)}
//           />

//           <Button
//             onClick={save}
//             className="w-full bg-orange-500 hover:bg-orange-600"
//           >
//             Save Address
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };



const Profile = () => {
  const searchParams = useSearchParams();
  const { user, logout } = useUserStore();

  const { addresses, addAddress, updateAddress, deleteAddress, isLoading: addressLoading } =
    useAddressQuery(user?._id);

  const { data: wishlist = [], removeFromWishlist, isLoading: wishlistLoading } =
    useWishlistQuery(user?._id);

  const { data: orders = [], isLoading: ordersLoading } =
    useOrdersQuery(user?._id);

  const [tab, setTab] = useState("profile");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const handleRemoveWishlist = (productId: string) => {
    if (user?._id) {
      removeFromWishlist({ userId: user._id, productId });
    }
  };

  const isLoading = addressLoading || wishlistLoading || ordersLoading;

  /* sync tab from URL */
  useEffect(() => {
    const t = searchParams?.get("tab");
    if (t) setTab(t);
  }, [searchParams]);

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <section className=" md:p-8 space-y-8">

      {/* ================= PROFILE HEADER ================= */}
      <div className=" bg-gradient-to-r md:rounded-xl from-red-500 to-red-900 p-4 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
            {user?.image ? (
              <AvatarImage src={user.image} />
            ) : (
              <AvatarFallback className="bg-white text-orange-600 text-3xl font-bold">
                {initials || "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="opacity-90">{user?.email}</p>
            {user?.phone && <p className="opacity-90">{user.phone}</p>}

            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <Badge className="bg-white/20 text-white">
                <Star className="w-3 h-3 mr-1" />
                {user?.loyaltyPoints || 0} Points
              </Badge>
              <Badge className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={() => setEditProfileOpen(true)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="border-white text-orange-600 hover:bg-white hover:text-orange-600"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-row-1 md:grid-row-3 gap-4  hidden lg:block">
        {isLoading ? (
          <>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard label="Orders" value={orders.length} icon={<Package />} />
            <StatCard label="Favorites" value={wishlist.length} icon={<Heart />} />
            <StatCard label="Addresses" value={addresses.length} icon={<MapPin />} />
          </>
        )}
      </div>

      {/* ================= TABS ================= */}
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-4 md:p-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-5 bg-muted rounded-xl">
              <TabBtn value="profile" icon={<User />} />
              <TabBtn value="orders" icon={<Package />} />
              <TabBtn value="favorites" icon={<Heart />} />
              <TabBtn value="addresses" icon={<MapPin />} />
              <TabBtn value="disputes" icon={<Clock />} />
            </TabsList>

            {/* PROFILE */}
            <TabsContent value="profile" className="mt-6">
              <ProfileInfo user={user} />
            </TabsContent>

            {/* ORDERS */}
            <TabsContent value="orders">
              <OrdersList orders={orders} />
            </TabsContent>

            {/* FAVORITES */}
            <TabsContent value="favorites">
              <WishlistGrid
                items={wishlist}
                onRemove={handleRemoveWishlist}
              />
            </TabsContent>

            {/* ADDRESSES */}
            <TabsContent value="addresses">
              <AddressList
                addresses={addresses}
                onAdd={() => setShowAddressModal(true)}
                onEdit={(a) => {
                  setEditAddress(a);
                  setShowAddressModal(true);
                }}
                onDelete={deleteAddress}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* MODALS */}
      {showAddressModal && (
        <AddAddressModal
          open
          editingAddress={editAddress || undefined}
          handleAddAddress={addAddress}
          setShowAddModal={setShowAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setEditAddress(null);
          }}
        />
      )}

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </section>
  );
};

/* ================= SMALL COMPONENTS ================= */

const StatCard = ({ label, value, icon }: any) => (
  <Card className="shadow-md hover:shadow-lg transition mt-1">
    <CardContent className="p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
        {icon}
      </div>
    </CardContent>
  </Card>
);

const TabBtn = ({ value, icon }: any) => (
  <TabsTrigger value={value} className="flex items-center gap-2">
    {icon}
    <span className="hidden sm:inline capitalize">{value}</span>
  </TabsTrigger>
);

export default Profile;
