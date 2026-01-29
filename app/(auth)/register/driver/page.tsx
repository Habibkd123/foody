"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bike, Upload, CreditCard, MapPin, ArrowLeft, ArrowRight, CheckCircle, Loader2, Camera } from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';

export default function DriverRegistration() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Personal
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',

        // Vehicle
        vehicleType: 'bike',
        vehicleNumber: '',
        licenseNumber: '',

        // Address
        address: '',
        city: '',
        pincode: '',

        // Bank
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',

        // Emergency
        emergencyName: '',
        emergencyPhone: '',

        // Documents
        documents: {
            licenseFront: '',
            licenseBack: '',
            aadharFront: '',
            aadharBack: '',
            vehicleRC: '',
            photo: ''
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
            if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
            if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
            else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }

        if (currentStep === 2) {
            if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
            if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
            if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
        }

        if (currentStep === 3) {
            if (!formData.documents.licenseFront) newErrors.licenseFront = 'License front is required';
            if (!formData.documents.aadharFront) newErrors.aadharFront = 'Aadhar front is required';
            if (!formData.documents.photo) newErrors.photo = 'Profile photo is required';
        }

        if (currentStep === 4) {
            if (!formData.address.trim()) newErrors.address = 'Address is required';
            if (!formData.city.trim()) newErrors.city = 'City is required';
            if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
            else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';
            if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
            if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
            else if (!/^\d{10}$/.test(formData.emergencyPhone)) newErrors.emergencyPhone = 'Invalid phone number';
        }

        if (currentStep === 5) {
            if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
            if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
            if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(5)) return;

        setLoading(true);
        try {
            const response = await fetch('/api/drivers/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: 'driver',
                }),
            });

            const result = await response.json();

            if (result.success) {
                setStep(6); // Success step
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        🚗 Become a Delivery Partner
                    </h1>
                    <p className="text-gray-600">
                        Join our team and start earning today!
                    </p>
                </div>

                {/* Progress Steps */}
                {step < 6 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div key={s} className="flex items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {s}
                                    </div>
                                    {s < 5 && (
                                        <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-orange-500' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                            <span>Personal</span>
                            <span>Vehicle</span>
                            <span>Documents</span>
                            <span>Address</span>
                            <span>Bank</span>
                        </div>
                    </div>
                )}

                {/* Step 1: Personal Details */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Personal Details
                            </CardTitle>
                            <CardDescription>Enter your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Rahul"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Kumar"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="rahul@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    maxLength={10}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <Button onClick={handleNext} className="w-full">
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Vehicle Details */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bike className="w-5 h-5" />
                                Vehicle Details
                            </CardTitle>
                            <CardDescription>Tell us about your vehicle</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="bike">Bike</option>
                                    <option value="scooter">Scooter</option>
                                    <option value="car">Car</option>
                                </select>
                                {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
                            </div>

                            <div>
                                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                                <Input
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    placeholder="DL01AB1234"
                                />
                                {errors.vehicleNumber && <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>}
                            </div>

                            <div>
                                <Label htmlFor="licenseNumber">Driving License Number *</Label>
                                <Input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="DL-0123456789012"
                                />
                                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleBack} variant="outline" className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button onClick={handleNext} className="flex-1">
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Document Upload */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Document Verification
                            </CardTitle>
                            <CardDescription>Upload photos of your documents for verification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DocumentUpload
                                    label="Driving License (Front) *"
                                    name="licenseFront"
                                    required
                                    onUpload={(file, url) => setFormData(p => ({ ...p, documents: { ...p.documents, licenseFront: url } }))}
                                    value={formData.documents.licenseFront}
                                />
                                <DocumentUpload
                                    label="Driving License (Back)"
                                    name="licenseBack"
                                    onUpload={(file, url) => setFormData(p => ({ ...p, documents: { ...p.documents, licenseBack: url } }))}
                                    value={formData.documents.licenseBack}
                                />
                                <DocumentUpload
                                    label="Aadhar Card (Front) *"
                                    name="aadharFront"
                                    required
                                    onUpload={(file, url) => setFormData(p => ({ ...p, documents: { ...p.documents, aadharFront: url } }))}
                                    value={formData.documents.aadharFront}
                                />
                                <DocumentUpload
                                    label="Aadhar Card (Back)"
                                    name="aadharBack"
                                    onUpload={(file, url) => setFormData(p => ({ ...p, documents: { ...p.documents, aadharBack: url } }))}
                                    value={formData.documents.aadharBack}
                                />
                                <DocumentUpload
                                    label="Vehicle RC *"
                                    name="vehicleRC"
                                    required
                                    onUpload={(file, url) => setFormData(p => ({ ...p, documents: { ...p.documents, vehicleRC: url } }))}
                                    value={formData.documents.vehicleRC}
                                />
                                <DocumentUpload
                                    label="Profile Photo *"
                                    name="photo"
                                    required
                                    onUpload={(file, url) => setFormData(p => ({ ...p, documents: { ...p.documents, photo: url } }))}
                                    value={formData.documents.photo}
                                />
                            </div>

                            {errors.licenseFront && <p className="text-red-500 text-sm">{errors.licenseFront}</p>}
                            {errors.aadharFront && <p className="text-red-500 text-sm">{errors.aadharFront}</p>}
                            {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}

                            <div className="flex gap-4">
                                <Button onClick={handleBack} variant="outline" className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button onClick={handleNext} className="flex-1">
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Address & Emergency Contact */}
                {step === 4 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Address & Emergency Contact
                            </CardTitle>
                            <CardDescription>Your address and emergency contact details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Street address"
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Delhi"
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="pincode">Pincode *</Label>
                                    <Input
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="110001"
                                        maxLength={6}
                                    />
                                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold mb-4">Emergency Contact</h3>
                                <div>
                                    <Label htmlFor="emergencyName">Contact Name *</Label>
                                    <Input
                                        id="emergencyName"
                                        name="emergencyName"
                                        value={formData.emergencyName}
                                        onChange={handleChange}
                                        placeholder="Family member name"
                                    />
                                    {errors.emergencyName && <p className="text-red-500 text-sm mt-1">{errors.emergencyName}</p>}
                                </div>

                                <div className="mt-4">
                                    <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                                    <Input
                                        id="emergencyPhone"
                                        name="emergencyPhone"
                                        value={formData.emergencyPhone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        maxLength={10}
                                    />
                                    {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleBack} variant="outline" className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button onClick={handleNext} className="flex-1">
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 5: Bank Details */}
                {step === 5 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Bank Details
                            </CardTitle>
                            <CardDescription>For receiving payments</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                                <Input
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                    placeholder="As per bank account"
                                />
                                {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
                            </div>

                            <div>
                                <Label htmlFor="accountNumber">Account Number *</Label>
                                <Input
                                    id="accountNumber"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                />
                                {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                            </div>

                            <div>
                                <Label htmlFor="ifscCode">IFSC Code *</Label>
                                <Input
                                    id="ifscCode"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    placeholder="SBIN0001234"
                                />
                                {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleBack} variant="outline" className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <CheckCircle className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 6: Success */}
                {step === 6 && (
                    <Card className="text-center">
                        <CardContent className="pt-6 pb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Application Submitted!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your application is under review. We'll notify you within 24-48 hours.
                            </p>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-700">
                                    <strong>What's Next?</strong><br />
                                    1. Admin will review your application<br />
                                    2. You'll receive an email/SMS notification<br />
                                    3. Once approved, you can login and start delivering!
                                </p>
                            </div>
                            <Button onClick={() => router.push('/login')} className="w-full">
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
