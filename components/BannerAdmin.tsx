"use client";

import React, { useEffect, useState, useCallback } from "react";

import ImageUploader from "@/components/admin/ImageUploader";
import BannerForm from "@/components/admin/BannerForm";
import BannerList from "@/components/admin/BannerList";
import UploadingOverlay from "@/components/admin/UploadingOverlay";

interface IBanner {
  _id: string;
  image: string[];
  title: string;
  type: string;
  active: boolean;
}

export default function BannerAdmin() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    type: "Home",
    active: true,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [pendingPreviewCount, setPendingPreviewCount] = useState<number>(0);
  const [uploadingNames, setUploadingNames] = useState<string[]>([]);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/banner");
      const data = await res.json();
      if(data.status){
      setBanners(data.banners);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);
console.log("banners",banners)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('image', file));

    try {
      const res = await fetch('/api/banner/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Upload failed');
      return data.files.map((file: any) => file.url);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(prev => [...prev, ...files]);
    setPendingPreviewCount(prev => prev + files.length);
    setUploadingNames(files.map(f => f.name));

    if (!formData.title) {
      const baseName = files[0].name.split('.')[0];
      setFormData(prev => ({ 
        ...prev, 
        title: baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
      }));
    }

    try {
      setUploading(true);
      const newUrls = await uploadImages(files);
      setUploadedUrls(prev => [...prev, ...newUrls]);
      setPreviews(prev => [...prev, ...newUrls]);
    } catch (err) {
      console.error('Immediate upload failed:', err);
      alert('Failed to upload selected images. Please try again.');
    } finally {
      setUploading(false);
      setPendingPreviewCount(prev => Math.max(0, prev - files.length));
      setUploadingNames([]);
      e.target.value = '';
    }
  }, [formData.title, uploadImages]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const toRemove = prev[index];
      const newPreviews = prev.filter((_, i) => i !== index);
      if (toRemove && toRemove.startsWith('blob:')) URL.revokeObjectURL(toRemove);
      return newPreviews;
    });
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (uploadedUrls.length === 0 && selectedFiles.length === 0) {
      alert("Please add at least one image (upload or select)");
      return;
    }

    setUploading(true);

    try {
      const urls = uploadedUrls.length > 0 ? uploadedUrls : await uploadImages(selectedFiles);
      const bannerPayload = {
        image: urls,
        title: formData.title,
        type: formData.type,
        active: formData.active,
      };

      const url = editId ? `/api/banner/${editId}` : "/api/banner";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerPayload),
      });

      if (!res.ok) throw new Error("Failed to save banner");

      resetForm();
      fetchBanners();
      alert(`Successfully ${editId ? 'updated' : 'created'} banner with ${urls.length} image${urls.length > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to upload images or save banners. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [uploadedUrls, selectedFiles, formData, editId, uploadImages, fetchBanners]);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      type: "Home",
      active: true,
    });
    setEditId(null);
    setSelectedFiles([]);
    setPreviews(prev => {
      prev.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
      return [];
    });
    setUploadedUrls([]);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const res = await fetch(`/api/banner/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchBanners();
    } else {
      alert("Failed to delete banner");
    }
  }, [fetchBanners]);

  const startEdit = useCallback((banner: IBanner) => {
    setFormData({
      title: banner.title || '',
      type: banner.type || 'Home',
      active: banner.active ?? true,
    });
    setEditId(banner._id);
    const urls = Array.isArray(banner.image) ? banner.image : [];
    setPreviews(urls);
    setUploadedUrls(urls);
    setSelectedFiles([]);
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
    };
  }, [previews]);

  return (
    <div className="min-h-screen bg-orange-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Banner Admin</h1>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">

              {/* Image Upload Section */}
              <ImageUploader
                selectedFiles={selectedFiles}
                previews={previews}
                pendingPreviewCount={pendingPreviewCount}
                handleFileChange={handleFileChange}
                removeFile={removeFile}
              />

              <BannerForm formData={formData} handleChange={handleChange} setFormData={setFormData} />

            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading || (uploadedUrls.length === 0 && selectedFiles.length === 0) || !formData.title.trim()}
                className="px-6 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editId ? 'Saving changes...' : `Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`}
                  </>
                ) : (
                  editId ? 'Update Banner' : 'Create Banner'
                )}
              </button>

              {selectedFiles.length > 0 && (
                <button
                  onClick={resetForm}
                  disabled={uploading}
                  className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
                >
                  Clear All
                </button>
              )}
            </div>

            {selectedFiles.length > 1 && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-orange-800">Multiple Images Selected</p>
                    <p className="text-sm text-orange-700 mt-1">
                      A single banner will be created with <strong>{selectedFiles.length} images</strong> and the title:
                    </p>
                    <div className="text-sm text-orange-600 mt-2">
                      <span className="inline-flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>"{formData.title}"</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Banners List Section */}
        <BannerList banners={banners} startEdit={startEdit} handleDelete={handleDelete} />
      </div>

      {/* Uploading Modal Overlay */}
      <UploadingOverlay uploading={uploading} uploadingNames={uploadingNames} />
    </div>
  );
}