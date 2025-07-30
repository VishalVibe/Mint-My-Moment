"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

interface NFTImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function NFTImage({ src, alt, width = 300, height = 300, className = "", priority = false }: NFTImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fallback image with proper query
  const fallbackSrc = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(alt)}`

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (imageError) {
    return (
      <div className={`bg-gray-700 flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400">Image not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center ${className}`}>
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <Image
        src={imageError ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={true}
      />
    </div>
  )
}
