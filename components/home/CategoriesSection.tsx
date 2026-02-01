// "use client"

// import React from "react"
// import { Product } from "@/types/global"
// import Image from "next/image"
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// type Category = {
//   _id?: string
//   id?: string
//   name: string
//   icon?: string
//   image?: string
//   isAllCategory?: boolean
// }

// interface Props {
//   categories: Category[]
//   products: Product[]
//   selectedCategory: string
//   setSelectedCategory: (id: string) => void
//   loading?: boolean
// }

// const getCategoryIcon = (name: string) => {
//   const s = name.toLowerCase()
//   if (s.includes("grocery")) return "🛍️"
//   if (s.includes("masala")) return "🌶️"
//   if (s.includes("fruit")) return "🍎"
//   if (s.includes("vegetable")) return "🥬"
//   if (s.includes("dairy")) return "🥛"
//   if (s.includes("meat")) return "🍗"
//   if (s.includes("snack")) return "🍿"
//   if (s.includes("beverage")) return "🥤"
//   if (s.includes("rice")) return "🌾"
//   return "🏪"
// }

// const SkeletonCard = () => (
//   <div className="bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl p-6 h-[180px] w-full" />
// )

// export default function CategoriesSection({
//   categories,
//   products,
//   selectedCategory,
//   loading = false,
//   setSelectedCategory,
// }: Props) {
//   const isSelected = (id: string) => selectedCategory === id

//   return (
//     <section id="home" className="relative">

//       <div className="">
//         {/* Heading */}
//         <div className="text-center mb-10">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
//             Shop by Category
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
//             Discover our wide range of farm-fresh products and daily essentials
//           </p>
//         </div>

//         <div className="categories-slider-wrapper relative px-4 sm:px-12">
//           {loading ? (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
//             </div>
//           ) : (
//             <Swiper
//               modules={[Navigation, Pagination, Autoplay]}
//               spaceBetween={24}
//               slidesPerView={1}
//               navigation={{
//                 prevEl: '.swiper-button-prev-custom',
//                 nextEl: '.swiper-button-next-custom',
//               }}
//               pagination={{ clickable: true, dynamicBullets: true }}
//               autoplay={{ delay: 3000, disableOnInteraction: false }}
//               breakpoints={{
//                 480: { slidesPerView: 2 },
//                 768: { slidesPerView: 3 },
//                 1024: { slidesPerView: 4 },
//                 1280: { slidesPerView: 6 },
//               }}

//               className="pb-12"
//             >
//               {categories.map((cat) => {
//                 const catId = (cat._id || cat.id) as string

//                 return (
//                   <SwiperSlide key={catId}>
//                     <div
//                       onClick={() => setSelectedCategory(catId)}
//                       className={`
//                         group cursor-pointer rounded-2xl p-8 text-center transition-all duration-500 h-full flex flex-col items-center justify-center
//                         ${isSelected(catId)
//                           ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]"
//                           : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1"
//                         }
//                       `}
//                     >
//                       <div className={`
//                         relative w-20 h-20 mx-auto rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500
//                         ${isSelected(catId) ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-800 group-hover:bg-primary/10'}
//                       `}>
//                         {cat.image ? (
//                           <Image
//                             src={cat.image}
//                             alt={cat.name}
//                             fill
//                             className="object-cover group-hover:scale-110 transition-transform duration-500"
//                           />
//                         ) : (
//                           <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
//                             {cat.icon || getCategoryIcon(cat.name)}
//                           </span>
//                         )}
//                       </div>

//                       <h3 className={`font-bold mt-5 text-lg transition-colors ${isSelected(catId) ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-primary'}`}>
//                         {cat.name}
//                       </h3>
//                       <p className={`text-sm mt-1 opacity-70 ${isSelected(catId) ? 'text-white/80' : 'text-gray-500'}`}>
//                         Explore Collection
//                       </p>
//                     </div>
//                   </SwiperSlide>
//                 )
//               })}
//             </Swiper>
//           )}

//           {/* Custom Navigation Buttons */}
//           <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all pointer-events-auto">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all pointer-events-auto">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       <style jsx global>{`
//         .categories-slider-wrapper .swiper-pagination-bullet-active {
//           background: #ff8a00 !important;
//           width: 24px !important;
//           border-radius: 4px !important;
//         }
//         .categories-slider-wrapper .swiper {
//           padding-top: 20px;
//           padding-bottom: 50px;
//         }
//       `}</style>
//     </section>
//   )
// }



"use client"

import React from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

type Category = {
  _id?: string
  id?: string
  name: string
  icon?: string
  image?: string
}

interface Props {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (id: string) => void
  loading?: boolean
}

const getCategoryIcon = (name: string) => {
  const s = name.toLowerCase()
  if (s.includes("fruit")) return "🍎"
  if (s.includes("vegetable")) return "🥬"
  if (s.includes("dairy")) return "🥛"
  if (s.includes("meat")) return "🍗"
  if (s.includes("snack")) return "🍿"
  if (s.includes("beverage")) return "🥤"
  return "🛒"
}

const SkeletonCard = () => (
  <div className="h-[220px] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
)

export default function CategoriesSection({
  categories,
  selectedCategory,
  setSelectedCategory,
  loading = false,
}: Props) {
  const isSelected = (id: string) => selectedCategory === id

  return (
    <section className="relative py-10 sm:py-14">
      {/* Heading */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Shop by Category
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Fresh groceries curated just for you
        </p>
      </div>

      <div className="relative px-4 sm:px-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: ".cat-prev",
              nextEl: ".cat-next",
            }}
            breakpoints={{
              480: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4.2 },
              1280: { slidesPerView: 5.2 },
            }}
            className="pb-12"
          >
            {categories.map((cat) => {
              const id = (cat._id || cat.id) as string

              return (
                <SwiperSlide key={id}>
                  <div
                    onClick={() => setSelectedCategory(id)}
                    className={`
                      relative h-[220px] rounded-3xl overflow-hidden cursor-pointer
                      transition-all duration-500
                      ${isSelected(id)
                        ? "ring-4 ring-primary scale-[1.03]"
                        : "hover:scale-[1.03]"
                      }
                    `}
                  >
                    {/* Image */}
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-6xl">
                        {cat.icon || getCategoryIcon(cat.name)}
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 p-5 w-full">
                      <h3 className="text-white text-lg font-bold">
                        {cat.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        Tap to explore
                      </p>
                    </div>

                    {/* Selected badge */}
                    {isSelected(id) && (
                      <span className="absolute top-4 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full font-bold">
                        Selected
                      </span>
                    )}
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}

        {/* Navigation buttons */}
        <button className="cat-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow flex items-center justify-center hover:bg-primary hover:text-white transition">
          ‹
        </button>
        <button className="cat-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow flex items-center justify-center hover:bg-primary hover:text-white transition">
          ›
        </button>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #ff8a00 !important;
          width: 22px !important;
          border-radius: 6px !important;
        }
      `}</style>
    </section>
  )
}
