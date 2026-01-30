"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, User, Bike, MapPin, CreditCard, Phone, Loader2 } from 'lucide-react';

interface Driver {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    driverDetails: {
        vehicleType: string;
        vehicleNumber: string;
        licenseNumber: string;
        address: {
            street: string;
            city: string;
            pincode: string;
        };
        bankDetails: {
            accountNumber: string;
            ifscCode: string;
            accountHolderName: string;
        };
        emergencyContact: {
            name: string;
            phone: string;
        };
        status: 'pending' | 'approved' | 'rejected';
        isVerified: boolean;
    };
    createdAt: string;
}

export default function DriverApprovalPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await fetch('/api/drivers');
            const result = await response.json();
            if (result.success) {
                setDrivers(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch drivers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (driverId: string) => {
        setActionLoading(driverId);
        try {
            const response = await fetch(`/api/drivers/${driverId}/approve`, {
                method: 'POST',
            });
            const result = await response.json();
            if (result.success) {
                fetchDrivers(); // Refresh list
                alert('Driver approved successfully!');
            }
        } catch (error) {
            console.error('Failed to approve driver:', error);
            alert('Failed to approve driver');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (driverId: string) => {
        const reason = prompt('Enter rejection reason (optional):');
        setActionLoading(driverId);
        try {
            const response = await fetch(`/api/drivers/${driverId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason }),
            });
            const result = await response.json();
            if (result.success) {
                fetchDrivers(); // Refresh list
                alert('Driver rejected');
            }
        } catch (error) {
            console.error('Failed to reject driver:', error);
            alert('Failed to reject driver');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredDrivers = drivers.filter(driver => {
        if (filter === 'all') return true;
        return driver.driverDetails.status === filter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'approved':
                return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">


            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    All ({drivers.length})
                </Button>
                <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({drivers.filter(d => d.driverDetails.status === 'pending').length})
                </Button>
                <Button
                    variant={filter === 'approved' ? 'default' : 'outline'}
                    onClick={() => setFilter('approved')}
                >
                    Approved ({drivers.filter(d => d.driverDetails.status === 'approved').length})
                </Button>
                <Button
                    variant={filter === 'rejected' ? 'default' : 'outline'}
                    onClick={() => setFilter('rejected')}
                >
                    Rejected ({drivers.filter(d => d.driverDetails.status === 'rejected').length})
                </Button>
            </div>

            {/* Driver Cards */}
            <div className="grid gap-6">
                {filteredDrivers.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-gray-500">
                            No drivers found
                        </CardContent>
                    </Card>
                ) : (
                    filteredDrivers.map((driver) => (
                        <Card key={driver._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            {driver.firstName} {driver.lastName}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Applied: {new Date(driver.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {getStatusBadge(driver.driverDetails.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Personal Info */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Personal Information
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Email:</strong> {driver.email}</p>
                                            <p><strong>Phone:</strong> {driver.phone}</p>
                                            <p>
                                                <strong>Emergency Contact:</strong><br />
                                                {driver.driverDetails.emergencyContact.name} - {driver.driverDetails.emergencyContact.phone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                            <Bike className="w-4 h-4" /> Vehicle Information
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Type:</strong> {driver.driverDetails.vehicleType}</p>
                                            <p><strong>Number:</strong> {driver.driverDetails.vehicleNumber}</p>
                                            <p><strong>License:</strong> {driver.driverDetails.licenseNumber}</p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Address
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p>{driver.driverDetails.address.street}</p>
                                            <p>{driver.driverDetails.address.city} - {driver.driverDetails.address.pincode}</p>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" /> Bank Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Account:</strong> {driver.driverDetails.bankDetails.accountNumber}</p>
                                            <p><strong>IFSC:</strong> {driver.driverDetails.bankDetails.ifscCode}</p>
                                            <p><strong>Name:</strong> {driver.driverDetails.bankDetails.accountHolderName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {driver.driverDetails.status === 'pending' && (
                                    <div className="flex gap-4 mt-6 pt-6 border-t">
                                        <Button
                                            onClick={() => handleApprove(driver._id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            disabled={actionLoading === driver._id}
                                        >
                                            {actionLoading === driver._id ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                            )}
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(driver._id)}
                                            variant="destructive"
                                            className="flex-1"
                                            disabled={actionLoading === driver._id}
                                        >
                                            {actionLoading === driver._id ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4 mr-2" />
                                            )}
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
