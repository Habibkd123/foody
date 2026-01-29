"use client";

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface DocumentUploadProps {
    label: string;
    name: string;
    accept?: string;
    required?: boolean;
    onUpload: (file: File, url: string) => void;
    value?: string;
}

export default function DocumentUpload({
    label,
    name,
    accept = "image/*,.pdf",
    required = false,
    onUpload,
    value
}: DocumentUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setUploading(true);

        try {
            // Create FormData for upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'driver_documents'); // Cloudinary preset

            // Upload to Cloudinary (or your preferred service)
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                setPreview(data.secure_url);
                onUpload(file, data.secure_url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-400 transition-colors">
                {!preview ? (
                    <div className="text-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id={name}
                            name={name}
                            accept={accept}
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                        <label
                            htmlFor={name}
                            className="cursor-pointer flex flex-col items-center"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-2" />
                                    <p className="text-sm text-gray-600">Uploading...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, PDF up to 10MB
                                    </p>
                                </>
                            )}
                        </label>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {preview.endsWith('.pdf') ? (
                                <FileText className="w-10 h-10 text-red-500" />
                            ) : (
                                <img
                                    src={preview}
                                    alt={label}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {fileName || 'Document uploaded'}
                                </p>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Uploaded successfully
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
