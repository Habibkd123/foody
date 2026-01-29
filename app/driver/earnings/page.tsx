"use client";

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Calendar, Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DriverEarningsPage() {
    const { user } = useUserStore();
    const router = useRouter();
    const [earnings, setEarnings] = useState({
        today: 0,
        week: 0,
        month: 0,
        total: 0,
    });

    const [recentPayouts, setRecentPayouts] = useState([
        { date: '2024-01-25', amount: 2500, status: 'Paid', method: 'Bank Transfer' },
        { date: '2024-01-18', amount: 3200, status: 'Paid', method: 'Bank Transfer' },
        { date: '2024-01-11', amount: 2800, status: 'Paid', method: 'Bank Transfer' },
    ]);

    useEffect(() => {
        if (user?.driverDetails?.earnings) {
            setEarnings({
                today: user.driverDetails.earnings.today || 0,
                week: user.driverDetails.earnings.thisWeek || 0,
                month: user.driverDetails.earnings.thisMonth || 0,
                total: user.driverDetails.earnings.total || 0,
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push('/driver')}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
                </div>

                {/* Earnings Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Today
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                ₹{earnings.today}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                This Week
                            </CardTitle>
                            <Calendar className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                ₹{earnings.week}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                This Month
                            </CardTitle>
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                ₹{earnings.month}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Earnings
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-bold text-gray-900">
                                    ₹{earnings.total}
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-orange-600 hover:bg-orange-700 h-8 text-xs"
                                    disabled={earnings.total < 500}
                                    onClick={() => alert(`Withdrawal request for ₹${earnings.total} submitted! It will be processed in 24-48 hours.`)}
                                >
                                    Withdraw
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">Min. withdrawal: ₹500</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bank Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Bank Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Holder:</span>
                                <span className="font-medium">
                                    {user?.driverDetails?.bankDetails?.accountHolderName || 'Not set'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Number:</span>
                                <span className="font-medium">
                                    {user?.driverDetails?.bankDetails?.accountNumber
                                        ? `****${user.driverDetails.bankDetails.accountNumber.slice(-4)}`
                                        : 'Not set'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">IFSC Code:</span>
                                <span className="font-medium">
                                    {user?.driverDetails?.bankDetails?.ifscCode || 'Not set'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Payouts */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Recent Payouts</CardTitle>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download Statement
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentPayouts.map((payout, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">₹{payout.amount}</p>
                                        <p className="text-sm text-gray-500">{payout.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-green-600">
                                            {payout.status}
                                        </p>
                                        <p className="text-xs text-gray-500">{payout.method}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
