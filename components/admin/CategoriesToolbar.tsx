"use client"

import React from "react"
import { Search, Plus } from "lucide-react"

interface Props {
  searchQuery: string
  setSearchQuery: (v: string) => void
  viewMode: 'table' | 'tree'
  setViewMode: (v: 'table' | 'tree') => void
  selectedCount: number
  onBulkDelete: () => void
  onForceDelete: () => void
  onAddClick: () => void
}

export default function CategoriesToolbar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  selectedCount,
  onBulkDelete,
  onForceDelete,
  onAddClick,
}: Props) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="flex gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'table' | 'tree')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="table">Table View</option>
          <option value="tree">Tree View</option>
        </select>
      </div>

      <div className="flex gap-2 w-full sm:w-auto justify-end">
        {selectedCount > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onBulkDelete}
              className="px-3 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete Selected ({selectedCount})
            </button>
            <button
              onClick={onForceDelete}
              className="px-3 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Force Delete
            </button>
          </div>
        )}

        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
    </div>
  )
}
