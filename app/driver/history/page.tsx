"use client";

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Search,
    Calendar,
    MapPin,
    ChevronRight,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HistoryOrder {
    _id: string;
    orderNumber: string;
    date: string;
    restaurant: string;
    deliveryAddress: string;
    amount: number;
    deliveryFee: number;
    status: 'delivered' | 'cancelled';
}

export default function RiderHistoryPage() {
    const { user } = useUserStore();
    const router = useRouter();
    const [orders, setOrders] = useState<HistoryOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        try {
            // Mocking history data
            const mockHistory: HistoryOrder[] = [
                {
                    _id: 'h1',
                    orderNumber: 'ORD-2024-001',
                    date: '2024-01-29 14:30',
                    restaurant: 'Pizza Palace',
                    deliveryAddress: '123 Main St, New Delhi',
                    amount: 650,
                    deliveryFee: 45,
                    status: 'delivered'
                },
                {
                    _id: 'h2',
                    orderNumber: 'ORD-2024-005',
                    date: '2024-01-28 19:15',
                    restaurant: 'Burger King',
                    deliveryAddress: '456 Park Ave, New Delhi',
                    amount: 420,
                    deliveryFee: 35,
                    status: 'delivered'
                },
                {
                    _id: 'h3',
                    orderNumber: 'ORD-2024-012',
                    date: '2024-01-27 12:00',
                    restaurant: 'Subway',
                    deliveryAddress: '789 Garden Rd, New Delhi',
                    amount: 300,
                    deliveryFee: 30,
                    status: 'cancelled'
                }
            ];
            setOrders(mockHistory);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push('/driver')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">Delivery History</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                            <Search className="w-5 h-5 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Calendar className="w-5 h-5 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className="rounded-full"
                    >
                        All Trips
                    </Button>
                    <Button
                        variant={filter === 'delivered' ? 'default' : 'outline'}
                        onClick={() => setFilter('delivered')}
                        className="rounded-full"
                    >
                        Delivered
                    </Button>
                    <Button
                        variant={filter === 'cancelled' ? 'default' : 'outline'}
                        onClick={() => setFilter('cancelled')}
                        className="rounded-full"
                    >
                        Cancelled
                    </Button>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders
                        .filter(o => filter === 'all' || o.status === filter)
                        .map((order) => (
                            <Card key={order._id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${order.status === 'delivered' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                {order.status === 'delivered' ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{order.restaurant}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {order.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₹{order.deliveryFee}</p>
                                            <Badge variant={order.status === 'delivered' ? 'outline' : 'destructive'} className="text-[10px]">
                                                {order.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        <p className="truncate">{order.deliveryAddress}</p>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
                                        <span>Order ID: {order.orderNumber}</span>
                                        <div className="flex items-center text-orange-600 font-medium">
                                            View Details <ChevronRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>

                {orders.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No delivery history found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
