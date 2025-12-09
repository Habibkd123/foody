"use client"

import React from "react"

interface Props {
  uploading: boolean
  uploadingNames: string[]
}

export default function UploadingOverlay({ uploading, uploadingNames }: Props) {
  if (!uploading) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Uploading images...</h3>
            <p className="text-sm text-gray-600">Please wait while we upload your file{uploadingNames.length > 1 ? 's' : ''}.</p>
          </div>
        </div>

        {uploadingNames.length > 0 && (
          <div className="mt-4 max-h-40 overflow-auto border border-orange-200 rounded-md p-3 bg-orange-50">
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
  )
}
