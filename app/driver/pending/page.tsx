"use client";

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/useUserStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';

export default function DriverPendingPage() {
    const { user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== 'driver') {
            router.push('/login');
            return;
        }

        // If approved, redirect to dashboard
        if (user.driverDetails?.status === 'approved') {
            router.push('/driver');
        }
    }, [user, router]);

    const status = user?.driverDetails?.status;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full">
                <CardContent className="pt-6 pb-6">
                    {status === 'pending' && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-12 h-12 text-yellow-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Application Under Review
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Thank you for applying! Our team is reviewing your application.
                            </p>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 text-left">
                                <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                                <ol className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-orange-600">1.</span>
                                        <span>Admin will verify your documents and details</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-orange-600">2.</span>
                                        <span>You'll receive an email/SMS notification within 24-48 hours</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-orange-600">3.</span>
                                        <span>Once approved, you can login and start delivering!</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-700">
                                    <strong>Application ID:</strong> {user?._id}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                    <strong>Submitted:</strong> {new Date(user?.createdAt || '').toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push('/login')}
                                >
                                    Back to Login
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => window.location.href = 'mailto:support@gro-delivery.com'}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === 'rejected' && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Application Not Approved
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Unfortunately, your driver application was not approved.
                            </p>

                            {user?.driverDetails?.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                                    <h3 className="font-semibold text-gray-900 mb-2">Reason:</h3>
                                    <p className="text-sm text-gray-700">
                                        {user.driverDetails.rejectionReason}
                                    </p>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-700">
                                    You can reapply after addressing the issues mentioned above.
                                    Please contact support if you need clarification.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push('/register/driver')}
                                >
                                    Reapply
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => window.location.href = 'mailto:support@gro-delivery.com'}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
