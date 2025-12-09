"use client"

import React, { useState } from "react"
import { Check, X, ChevronDown, ChevronRight, Edit2, Trash2 } from "lucide-react"

export interface Category {
  _id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  image?: string
  createdAt: string
  products_count: number
  subcategories?: Category[]
}

interface Props {
  categories: Category[]
  selectedIds: Set<string>
  onToggleSelectAll: () => void
  onToggleSelection: (id: string) => void
  viewMode: 'table' | 'tree'
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
}

function Row({ category, selected, onToggleSelection, onEdit, onDelete, viewMode, level = 0 }: {
  category: Category
  selected: boolean
  onToggleSelection: () => void
  onEdit: () => void
  onDelete: () => void
  viewMode: 'table' | 'tree'
  level?: number
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelection}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {viewMode === 'tree' && category.subcategories && category.subcategories.length > 0 && (
              <button onClick={() => setExpanded(!expanded)} className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            {category.image && (
              <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded-lg mr-4 border border-gray-200 dark:border-gray-600" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{category.description}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {category.products_count} products
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
            {category.status === 'active' ? (<><Check className="w-3 h-3 mr-1" /> Active</>) : (<><X className="w-3 h-3 mr-1" /> Inactive</>)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {new Date(category.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button onClick={onEdit} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded" title="Edit category">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete category">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {viewMode === 'tree' && expanded && category.subcategories?.map(sub => (
        <Row
          key={sub._id}
          category={sub}
          selected={selected}
          onToggleSelection={onToggleSelection}
          onEdit={onEdit}
          onDelete={onDelete}
          viewMode={viewMode}
          level={level + 1}
        />
      ))}
    </>
  )
}

export default function CategoriesTable({ categories, selectedIds, onToggleSelectAll, onToggleSelection, viewMode, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={categories.length > 0 && selectedIds.size === categories.length}
                  onChange={onToggleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(categories) && categories.map(category => (
              <Row
                key={category._id}
                category={category}
                selected={selectedIds.has(category._id)}
                onToggleSelection={() => onToggleSelection(category._id)}
                onEdit={() => onEdit(category)}
                onDelete={() => onDelete(category._id)}
                viewMode={viewMode}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
