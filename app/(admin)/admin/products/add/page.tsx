"use client";
import React from 'react'
import dynamic from 'next/dynamic'
const ProductPage = dynamic(() => import('@/components/AdminProducts'), { ssr: false })

const page = () => {
  return (
    <div>
      <ProductPage />
    </div>
  )
}

export default page
