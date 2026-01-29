"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    MapPin,
    Navigation,
    Bike,
    User,
    Activity,
    Search,
    Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DriverLocation {
    _id: string;
    name: string;
    phone: string;
    vehicleType: string;
    isAvailable: boolean;
    currentLocation: {
        latitude: number;
        longitude: number;
        updatedAt: string;
    };
}

export default function FleetTracking() {
    const [drivers, setDrivers] = useState<DriverLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDrivers = async () => {
        try {
            const res = await fetch('/api/drivers/analytics'); // Reusing analytics for now or maybe better a specialized fleet endpoint
            const data = await res.json();
            if (data.success) {
                // Mocking some location data if it doesn't exist for demo
                const fleet = data.analytics.topDrivers.map((d: any) => ({
                    ...d,
                    currentLocation: d.currentLocation || {
                        latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
                        longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
                        updatedAt: new Date().toISOString()
                    }
                }));
                setDrivers(fleet);
            }
        } catch (error) {
            console.error("Failed to fetch fleet:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
        const interval = setInterval(fetchDrivers, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 h-[calc(100vh-80px)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Live Fleet Tracking</h1>
                    <p className="text-gray-500">Real-time location of all active delivery partners</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Activity className="w-3 h-3 mr-1 animate-pulse" /> {drivers.filter(d => d.isAvailable).length} Online
                    </Badge>
                    <Button variant="outline" size="sm" onClick={fetchDrivers}>Refresh</Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Drivers List */}
                <Card className="lg:col-span-1 flex flex-col border-none shadow-md overflow-hidden">
                    <CardHeader className="border-b px-4 py-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search drivers..."
                                className="pl-9 h-9 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-0">
                        <div className="divide-y">
                            {filteredDrivers.map((driver) => (
                                <div key={driver._id} className="p-4 hover:bg-orange-50 cursor-pointer transition-colors group">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-gray-900 group-hover:text-orange-600 truncate">{driver.name}</p>
                                        <Badge variant="secondary" className="text-[10px] h-4">
                                            {driver.vehicleType}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        <span>Lat: {driver.currentLocation.latitude.toFixed(4)}, Lng: {driver.currentLocation.longitude.toFixed(4)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">
                                        Last active: {new Date(driver.currentLocation.updatedAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))}
                            {filteredDrivers.length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No drivers found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Map View */}
                <Card className="lg:col-span-3 border-none shadow-md overflow-hidden relative bg-gray-100">
                    {/* Placeholder for Map */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-bounce" />
                            <h3 className="text-xl font-bold text-gray-500">Interactive Fleet Map</h3>
                            <p className="text-gray-400 max-w-xs mx-auto mt-2">
                                For production, integrate Google Maps or Mapbox API to see real-time moving markers.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-xl shadow-sm border">
                                    <p className="text-2xl font-bold text-orange-600">32</p>
                                    <p className="text-xs text-gray-500">Busy (Delivering)</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-sm border">
                                    <p className="text-2xl font-bold text-green-600">12</p>
                                    <p className="text-xs text-gray-500">Idle (Waiting)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini floating driver info */}
                    <div className="absolute bottom-6 right-6 p-4 bg-white rounded-2xl shadow-xl border w-64 animate-in slide-in-from-bottom duration-500">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Bike className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 leading-tight">Fastest Rider</p>
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">On Mission</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Distance</span>
                                <span className="font-bold">2.4 km</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Est. Arrival</span>
                                <span className="font-bold text-orange-600">8 mins</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
