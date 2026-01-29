"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Phone,
    MessageCircle,
    Mail,
    HelpCircle,
    ChevronRight,
    ArrowLeft,
    LifeBuoy,
    FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RiderSupportPage() {
    const router = useRouter();

    const faqs = [
        { q: "How do I withdraw my earnings?", a: "Earnings are automatically transferred to your linked bank account every Monday." },
        { q: "What to do if customer is not picking up?", a: "Try calling the customer 3 times. If no response, contact support through the 'Current Order' chat." },
        { q: "How to change my vehicle details?", a: "Go to Profile > Settings > Vehicle Details and upload your new RC for verification." },
        { q: "Safety during Night Deliveries", a: "Always wear your reflective vest and keep your live location shared with a family member." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push('/driver')}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Partner Support</h1>
                </div>

                {/* Quick Help Section */}
                <Card className="bg-orange-600 text-white border-none shadow-lg mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <LifeBuoy className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">How can we help?</h2>
                                <p className="text-orange-100 text-sm">We're here 24/7 for our partners</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold h-12">
                                <Phone className="w-4 h-4 mr-2" /> Call Support
                            </Button>
                            <Button className="bg-white/20 text-white hover:bg-white/30 font-semibold h-12 border-white/50">
                                <MessageCircle className="w-4 h-4 mr-2" /> Chat with Us
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Help Categories */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="hover:border-orange-200 cursor-pointer transition-colors">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium">Policy Docs</span>
                            </CardContent>
                        </Card>
                        <Card className="hover:border-orange-200 cursor-pointer transition-colors">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-sm font-medium">Email Support</span>
                            </CardContent>
                        </Card>
                    </div>

                    {/* FAQs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-orange-600" /> Frequent Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center group">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                                {faq.q}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Details Footer */}
                    <div className="text-center space-y-2 py-4">
                        <p className="text-xs text-gray-500">Gro-Delivery Partner Hotline</p>
                        <p className="text-lg font-bold text-gray-800">1800-456-7890</p>
                        <p className="text-xs text-gray-400 font-medium">Available in Hindi, English, and Punjabi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
