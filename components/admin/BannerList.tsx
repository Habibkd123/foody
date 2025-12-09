"use client"

import React from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation as SwiperNavigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export interface IBanner {
  _id: string
  image: string[]
  title: string
  type: string
  active: boolean
}

interface Props {
  banners: IBanner[]
  startEdit: (b: IBanner) => void
  handleDelete: (id: string) => void
}

export default function BannerList({ banners, startEdit, handleDelete }: Props) {
  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-orange-200">
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
            {Array.isArray(banners) && banners.map((banner) => (
              <div key={banner._id} className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow">
                <div className="relative w-full rounded-md overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{ clickable: true }}
                    modules={[SwiperNavigation, Pagination]}
                    className="h-full"
                  >
                    {banner.image && banner.image.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiIGZpbGw9IiM5OTkiLz4KPHBhdGggZD0ibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjEiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+'
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="space-y-2 mb-4 mt-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">{banner.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${banner.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-orange-600 font-medium">Type: {banner.type}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => startEdit(banner)} className="flex-1 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(banner._id)} className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
