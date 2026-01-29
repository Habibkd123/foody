"use client";

import { useUserStore } from '@/lib/store/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    Bike,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    LogOut,
    ArrowLeft,
    Settings,
    Edit2,
    Star,
    MessageSquare,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RiderProfilePage() {
    const { user, logout } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push('/driver')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Settings className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-orange-500" />
                    <div className="relative pt-8">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto p-1 shadow-md mb-4">
                            <div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-orange-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Verified Partner</span>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 mt-8 border-t pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-black text-gray-900">
                                    {user?.driverDetails?.stats?.rating?.toFixed(1) || '5.0'}
                                </p>
                                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Rating</span>
                                </div>
                            </div>
                            <div className="text-center border-l">
                                <p className="text-2xl font-black text-gray-900">
                                    {user?.driverDetails?.stats?.reviews || 0}
                                </p>
                                <div className="flex items-center justify-center gap-1 text-gray-400">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-orange-600" /> Personal Info
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-orange-600 text-xs">
                                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Email Address</p>
                                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Primary City</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.driverDetails?.address?.city || 'Delhi'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle Info */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bike className="w-5 h-5 text-orange-600" /> Vehicle Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Vehicle Type</p>
                                    <p className="text-sm font-medium text-gray-900 capitalize">
                                        {user?.driverDetails?.vehicleType}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Vehicle Number</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.driverDetails?.vehicleNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">License Number</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.driverDetails?.licenseNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Status</p>
                                    <p className="text-sm font-medium text-green-600">Active</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verified Documents */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-orange-600" /> Verified Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {user?.driverDetails?.documents && Object.entries(user.driverDetails.documents).map(([key, url]) => (
                                    url && (
                                        <div key={key} className="space-y-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold truncate">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </p>
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group cursor-pointer" onClick={() => window.open(url as string, '_blank')}>
                                                <img src={url as string} alt={key} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ImageIcon className="text-white w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                                {(!user?.driverDetails?.documents || Object.values(user.driverDetails.documents || {}).every(v => !v)) && (
                                    <div className="col-span-full py-4 text-center">
                                        <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No documents uploaded</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logout Button */}
                    <Button
                        variant="destructive"
                        className="w-full h-12 rounded-xl"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Logout Account
                    </Button>

                    <p className="text-center text-xs text-gray-400 pb-8">
                        Partner since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
