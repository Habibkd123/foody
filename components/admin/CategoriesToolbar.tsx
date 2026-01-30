
"use client"

import React from "react"
import { Search, Plus, Trash2, ShieldAlert, List, LayoutGrid, ListTree } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    <div className="flex flex-col lg:flex-row gap-4 mb-6 bg-card p-4 rounded-xl shadow-soft animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
        {/* Search */}
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onValueChange={(val) => setViewMode(val as 'table' | 'tree')}
          >
            <SelectTrigger className="w-[160px] bg-background">
              <div className="flex items-center gap-2">
                {viewMode === 'table' ? <List className="h-4 w-4" /> : <ListTree className="h-4 w-4" />}
                <SelectValue placeholder="View Mode" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table View</SelectItem>
              <SelectItem value="tree">Tree View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
        {selectedCount > 0 && (
          <TooltipProvider>
            <div className="flex items-center gap-2 mr-2 pr-4 border-r border-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onBulkDelete}
                    className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete ({selectedCount})
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Selected</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onForceDelete}
                    className="text-rose-600 hover:bg-rose-100 h-9 w-9"
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Force Delete All Selected</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}

        <Button
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90 text-white shadow-soft font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>
    </div>
  )
}
