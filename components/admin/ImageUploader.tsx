"use client"

import React from "react"

interface Props {
  selectedFiles: File[]
  previews: string[]
  pendingPreviewCount: number
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (index: number) => void
}

export default function ImageUploader({ selectedFiles, previews, pendingPreviewCount, handleFileChange, removeFile }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Upload Banner Images *</label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF or WebP (Multiple files allowed)</p>
            </div>
            <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        {selectedFiles.length > 0 && (
          <p className="text-sm text-green-600">
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {(previews.length > 0 || pendingPreviewCount > 0) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Selected Images ({previews.length + pendingPreviewCount})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={`preview-${index}`} className="relative group">
                <div className="aspect-video bg-orange-100 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-orange-300 transition-colors">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
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
                    {selectedFiles[index] ? (selectedFiles[index].size / 1024 / 1024).toFixed(2) : '0.00'} MB
                  </p>
                </div>
              </div>
            ))}

            {Array.from({ length: pendingPreviewCount }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="relative animate-pulse">
                <div className="aspect-video bg-orange-200 rounded-lg overflow-hidden border-2 border-dashed border-orange-300 flex items-center justify-center">
                  <div className="w-10 h-10 bg-orange-300 rounded-full" />
                </div>
                <div className="mt-2 h-3 bg-orange-200 rounded w-3/4" />
                <div className="mt-1 h-3 bg-orange-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
