"use client";

import { ChevronDownIcon, Navigation } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


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

  async function fetchBanners() {
    const res = await fetch("/api/banner");
    const data = await res.json();
    setBanners(data);
  }

  useEffect(() => {
    fetchBanners();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Accumulate selected files across multiple selections (for potential fallback)
    setSelectedFiles(prev => [...prev, ...files]);

    // Set pending skeletons and names for modal
    setPendingPreviewCount(prev => prev + files.length);
    setUploadingNames(files.map(f => f.name));

    // Auto-generate title if empty
    if (!formData.title) {
      const baseName = files[0].name.split('.')[0];
      setFormData(prev => ({ ...prev, title: baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }));
    }

    // Upload immediately and append URLs
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
      // clear the input value so the same file can be re-selected if needed
      e.target.value = '';
    }
  }

  function removeFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const toRemove = prev[index];
      const newPreviews = prev.filter((_, i) => i !== index);
      // Only revoke if it's a blob URL
      if (toRemove && toRemove.startsWith('blob:')) URL.revokeObjectURL(toRemove);
      return newPreviews;
    });
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  }

  async function uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();

    // Append all files to the form data
    files.forEach(file => {
      formData.append('image', file);
    });

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

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      // Extract URLs from the response
      return data.files.map((file: any) => file.url);

    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  async function handleSubmit() {
    // Allow submission if there are either already uploaded URLs (e.g., from edit) or newly selected files
    if (uploadedUrls.length === 0 && selectedFiles.length === 0) {
      alert("Please add at least one image (upload or select)");
      return;
    }

    setUploading(true);

    try {
      // If immediate uploads already produced URLs, use them. Otherwise upload now.
      const urls = uploadedUrls.length > 0 ? uploadedUrls : await uploadImages(selectedFiles);

      // Create a single banner with one title and all uploaded images
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

      if (!res.ok) {
        throw new Error("Failed to save banner");
      }

      resetForm();
      fetchBanners();
      alert(`Successfully ${editId ? 'updated' : 'created'} banner with ${urls.length} image${urls.length > 1 ? 's' : ''}!`);

    } catch (error) {
      console.error('Error:', error);
      alert("Failed to upload images or save banners. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
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
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this banner?")) return;
    const res = await fetch(`/api/banner/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchBanners();
    } else {
      alert("Failed to delete banner");
    }
  }

  function startEdit(banner: IBanner) {
    // Populate form with existing banner data
    setFormData({
      title: banner.title || '',
      type: banner.type || 'Home',
      active: banner.active ?? true,
      
    });
    setEditId(banner._id);

    // Use existing image URLs as previews and as already-uploaded URLs
    const urls = Array.isArray(banner.image) ? banner.image : [];
    setPreviews(urls);
    setUploadedUrls(urls);

    // Clear any newly selected files from previous state
    setSelectedFiles([]);
  }

  // Clean up previews on component unmount
  useEffect(() => {
    return () => {
      previews.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
    };
  }, []);
console.log("Previews:", formData);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Banner Admin</h1>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Upload Banner Images *</label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF or WebP (Multiple files allowed)</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-green-600">
                      {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                {/* Image Previews and Upload Skeletons */}
                {(previews.length > 0 || pendingPreviewCount > 0) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Selected Images ({previews.length + pendingPreviewCount})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Existing previews */}
                      {previews.map((preview, index) => (
                        <div key={`preview-${index}`} className="relative group">
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-blue-300 transition-colors">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove image"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b-lg">
                            <p className="truncate" title={selectedFiles[index]?.name}>
                              {selectedFiles[index]?.name}
                            </p>
                            <p className="text-gray-300">
                              {(selectedFiles[index]?.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Skeleton placeholders while uploading */}
                      {Array.from({ length: pendingPreviewCount }).map((_, idx) => (
                        <div key={`skeleton-${idx}`} className="relative animate-pulse">
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full" />
                          </div>
                          <div className="mt-2 h-3 bg-gray-200 rounded w-3/4" />
                          <div className="mt-1 h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    name="title"
                    placeholder="Banner title"
                    maxLength={100}
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center space-x-3">
                  <input
                    name="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                {/* Type Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select type</option>
                    <option value="Home">Home</option>
                    <option value="LandInding">Landing</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading || (uploadedUrls.length === 0 && selectedFiles.length === 0) || !formData.title.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Multiple Images Selected</p>
                    <p className="text-sm text-blue-700 mt-1">
                      A single banner will be created with <strong>{selectedFiles.length} images</strong> and the title:
                    </p>
                    <div className="text-sm text-blue-600 mt-2">
                      <span className="inline-flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>"{formData.title}"</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Banners List Section */}
        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Existing Banners</h2>
          </div>

          <div className="p-6">
            {banners.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No banners found</div>
                <div className="text-gray-500 text-sm mt-2">Create your first banner using the form above</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <div key={banner._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      navigation={true}
                      pagination={{ clickable: true }}
                      modules={[Pagination]}
                    >
                      {banner.image &&
                        banner.image.map((image, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={image}
                              alt={banner.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiIGZpbGw9IiM5OTkiLz4KPHBhdGggZD0ibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjEiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                              }}
                            />
                          </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">{banner.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${banner.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {banner.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p>type:{banner.type}</p>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => startEdit(banner)}
                        className="flex-1 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Uploading Modal Overlay */}
      {uploading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Uploading images...</h3>
                <p className="text-sm text-gray-600">Please wait while we upload your file{uploadingNames.length > 1 ? 's' : ''}.</p>
              </div>
            </div>

            {uploadingNames.length > 0 && (
              <div className="mt-4 max-h-40 overflow-auto border rounded-md p-3 bg-gray-50">
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {uploadingNames.map((name, idx) => (
                    <li key={`uploading-${idx}`}>{name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">Do not close this window until the upload completes.</div>
          </div>
        </div>
      )}
    </div>
  );
}