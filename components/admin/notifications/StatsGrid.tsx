"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string // tailwind gradient from-to colors
}

interface Props {
  items: StatItem[]
}

export default function StatsGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {items.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
          <CardContent className="p-4 sm:p-6 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                <p className={`text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent mt-1`}>
                  {value.toLocaleString()}
                </p>
              </div>
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 group-hover:text-current group-hover:scale-110 transition-all duration-300" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
