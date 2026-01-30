
"use client"

import React, { useState } from "react"
import { Check, X, ChevronDown, ChevronRight, Pencil, Trash2, Eye, LayoutGrid, ListTree, Calendar, Package } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

function CategoryRow({ category, selected, onToggleSelection, onEdit, onDelete, viewMode, level = 0 }: {
  category: Category
  selected: boolean
  onToggleSelection: () => void
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
  viewMode: 'table' | 'tree'
  level?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const hasSubcategories = category.subcategories && category.subcategories.length > 0

  return (
    <>
      <TableRow className={`group hover:bg-muted/50 transition-colors ${selected ? 'bg-primary/5' : ''}`}>
        <TableCell className="w-[50px] pl-6">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelection}
            className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary h-4 w-4"
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
            {viewMode === 'tree' && (
              <div className="w-8 flex justify-center mr-1">
                {hasSubcategories ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-primary/10 transition-transform"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                ) : (
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                )}
              </div>
            )}

            <Avatar className="h-10 w-10 border border-border mr-3">
              <AvatarImage src={category.image} alt={category.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {category.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-none">{category.name}</span>
              <span className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[200px]">{category.description}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none font-medium flex items-center w-fit gap-1">
            <Package className="h-3 w-3" />
            {category.products_count} products
          </Badge>
        </TableCell>
        <TableCell>
          <Badge
            variant={category.status === 'active' ? 'default' : 'outline'}
            className={`
              border-none px-2.5 py-0.5 font-medium
              ${category.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500'}
            `}
          >
            {category.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {new Date(category.createdAt).toLocaleDateString()}
          </div>
        </TableCell>
        <TableCell className="text-right pr-6">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50" asChild>
                    <Link href={`/admin/categories/${category._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:bg-amber-50" onClick={() => onEdit(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Category</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => onDelete(category._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Category</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>
      </TableRow>

      {viewMode === 'tree' && expanded && category.subcategories?.map(sub => (
        <CategoryRow
          key={sub._id}
          category={sub}
          selected={selected}
          onToggleSelection={onToggleSelection}
          onEdit={() => onEdit(sub)}
          onDelete={() => onDelete(sub._id)}
          viewMode={viewMode}
          level={level + 1}
        />
      ))}
    </>
  )
}

export default function CategoriesTable({ categories, selectedIds, onToggleSelectAll, onToggleSelection, viewMode, onEdit, onDelete }: Props) {
  const allSelected = categories.length > 0 && selectedIds.size === categories.length

  return (
    <div className="bg-card rounded-xl shadow-soft overflow-hidden border-none animate-fadeIn">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px] pl-6">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
              </TableHead>
              <TableHead className="min-w-[200px] text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inventory</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Created At</TableHead>
              <TableHead className="text-right pr-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map(category => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  selected={selectedIds.has(category._id)}
                  onToggleSelection={() => onToggleSelection(category._id)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
