"use client";

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Package,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Phone,
  User,
  Bike
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCustomToast } from '@/hooks/useCustomToast';
import { BellRing } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  restaurant: {
    name: string;
    address: string;
  };
  items: any[];
  totalAmount: number;
  deliveryFee: number;
  status: 'assigned' | 'picked_up' | 'delivered';
  distance: string;
  estimatedTime: string;
}

export default function DriverDashboard() {
  const { user } = useUserStore();
  const router = useRouter();
  const toast = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    totalDeliveries: 0,
    completedToday: 0,
    rating: 5.0,
    reviews: 0,
  });
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const { location: geoCoords } = useGeolocation();

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      router.push('/login');
      return;
    }

    // Check if driver is approved
    if (user.driverDetails?.status !== 'approved') {
      router.push('/driver/pending');
      return;
    }

    fetchDriverData();
    fetchActiveOrders();

    // Socket Initialization for Real-time alerts
    let socket: any;
    const initSocket = async () => {
      // Ensure socket server is up
      await fetch('/api/socket', { method: 'POST' });

      const { io } = await import('socket.io-client');
      socket = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      socket.on('connect', () => {
        console.log('Driver connected to socket:', socket.id);
        // Join driver room for targeted notifications
        socket.emit('join', user._id);
      });

      socket.on('newOrderAssignment', (data: any) => {
        console.log('Real-time assignment received:', data);
        toast.info(
          'New Order Assigned!',
          `Order #${data.orderNumber} is ready for pickup.`
        );
        // Add a notification sound if possible
        try { new Audio('/sounds/notification.mp3').play(); } catch (e) { }

        // Refresh orders and stats
        fetchActiveOrders();
        fetchDriverData();
      });
    };

    initSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  const fetchDriverData = async () => {
    try {
      const response = await fetch(`/api/drivers/${user?._id}/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setIsOnline(data.isOnline);
      }
    } catch (error) {
      console.error('Failed to fetch driver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const response = await fetch(`/api/drivers/${user?._id}/orders`);
      const data = await response.json();
      if (data.success) {
        setActiveOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  // Sync location with backend
  useEffect(() => {
    if (isOnline && geoCoords && user?._id) {
      const updateLocation = async () => {
        try {
          await fetch(`/api/drivers/${user._id}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: geoCoords.latitude,
              longitude: geoCoords.longitude,
              heading: geoCoords.heading,
              speed: geoCoords.speed,
            }),
          });
        } catch (error) {
          console.error('Failed to update location:', error);
        }
      };

      // Update immediately on change or every 30s
      updateLocation();
      const interval = setInterval(updateLocation, 30000);
      return () => clearInterval(interval);
    }
  }, [isOnline, geoCoords, user?._id]);

  const toggleOnlineStatus = async () => {
    try {
      const response = await fetch(`/api/drivers/${user?._id}/toggle-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: !isOnline }),
      });
      const data = await response.json();
      if (data.success) {
        setIsOnline(!isOnline);
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: user?._id }),
      });
      if (response.ok) {
        fetchActiveOrders();
      }
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const handlePickup = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/pickup`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchActiveOrders();
      }
    } catch (error) {
      console.error('Failed to mark pickup:', error);
    }
  };

  const handleDelivered = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/delivered`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchActiveOrders();
        fetchDriverData();
      }
    } catch (error) {
      console.error('Failed to mark delivered:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Bike className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {user?.firstName}! 👋
                </h1>
                <p className="text-gray-600">
                  {user?.driverDetails?.vehicleType} • {user?.driverDetails?.vehicleNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleOnlineStatus}
                className={`${isOnline
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 hover:bg-gray-500'
                  }`}
              >
                {isOnline ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Online
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Offline
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today's Earnings
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{stats.todayEarnings}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.completedToday} deliveries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Week
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{stats.weekEarnings}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Deliveries
              </CardTitle>
              <Package className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalDeliveries}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Rating
              </CardTitle>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.rating}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.reviews} reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Active Orders ({activeOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  {isOnline && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-orange-400 opacity-25"></div>
                  )}
                  <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${isOnline ? 'bg-orange-100 shadow-inner' : 'bg-gray-100'}`}>
                    <Package className={`w-12 h-12 ${isOnline ? 'text-orange-600' : 'text-gray-400'}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isOnline ? "Looking for nearby orders..." : "You're currently offline"}
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">
                  {isOnline
                    ? "Keep the app open to receive new delivery assignments in your area."
                    : "Go online to start receiving new orders and earning today."}
                </p>
                {!isOnline && (
                  <Button
                    onClick={toggleOnlineStatus}
                    className="bg-orange-600 hover:bg-orange-700 rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-orange-200 transition-all"
                  >
                    Go Online Now
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge className="mt-1">
                          {order.status === 'assigned' && 'New Order'}
                          {order.status === 'picked_up' && 'In Transit'}
                          {order.status === 'delivered' && 'Delivered'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ₹{order.deliveryFee}
                        </p>
                        <p className="text-xs text-gray-500">Delivery fee</p>
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="bg-orange-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Pickup from:</p>
                          <p className="text-sm text-gray-700">
                            {order.restaurant.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.restaurant.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Deliver to:</p>
                          <p className="text-sm text-gray-700">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.customer.address}
                          </p>
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="text-xs text-blue-600 flex items-center gap-1 mt-1"
                          >
                            <Phone className="w-3 h-3" />
                            {order.customer.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-4 h-4" />
                          {order.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {order.estimatedTime}
                        </span>
                      </div>
                      <span className="font-semibold">
                        Total: ₹{order.totalAmount}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {order.status === 'assigned' && (
                        <>
                          <Button
                            onClick={() => handleAcceptOrder(order._id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Order
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      {order.status === 'picked_up' && (
                        <>
                          <Button
                            onClick={() => handlePickup(order._id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Mark as Picked Up
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.open(`https://maps.google.com/?q=${order.customer.address}`, '_blank')}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Navigate
                          </Button>
                        </>
                      )}
                      {order.status === 'picked_up' && (
                        <Button
                          onClick={() => handleDelivered(order._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Button variant="outline" className="h-20" onClick={() => router.push('/driver/earnings')}>
            <div className="text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">Earnings</span>
            </div>
          </Button>
          <Button variant="outline" className="h-20" onClick={() => router.push('/driver/history')}>
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">History</span>
            </div>
          </Button>
          <Button variant="outline" className="h-20" onClick={() => router.push('/driver/profile')}>
            <div className="text-center">
              <User className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">Profile</span>
            </div>
          </Button>
          <Button variant="outline" className="h-20" onClick={() => router.push('/driver/support')}>
            <div className="text-center">
              <Phone className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">Support</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
