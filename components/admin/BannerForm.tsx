"use client"

import React from "react"

interface FormData {
  title: string
  type: string
  active: boolean
}

interface Props {
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setFormData: (v: FormData) => void
}

export default function BannerForm({ formData, handleChange, setFormData }: Props) {
  return (
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
          className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm 
                 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Active Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          name="active"
          type="checkbox"
          checked={formData.active}
          onChange={handleChange}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
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
          className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm 
                 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        >
          <option value="">Select type</option>
          <option value="Home">Home</option>
          <option value="LandInding">Landing</option>
        </select>
      </div>
    </div>
  )
}
