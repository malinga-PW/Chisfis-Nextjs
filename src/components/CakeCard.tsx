'use client'

import StartRating from '@/components/StartRating'
import { Badge } from '@/shared/Badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { Location06Icon } from '@hugeicons/core-free-icons'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useCallback, useRef, useState } from 'react'
import { TCakeListing } from '@/data/cakes'

interface CakeCardProps {
  className?: string
  data: TCakeListing
}

const CakeCard: FC<CakeCardProps> = ({ className = '', data }) => {
  const { vendorName, title, deliveryAreas, price, rating, reviewsCount, featuredImage, id, gallery } = data
  const images = [featuredImage, ...(gallery || []).slice(0, 4)]
  const [hovered, setHovered] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoSlide = useCallback(() => {
    stopAutoSlide()
    intervalRef.current = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % images.length)
    }, 1500)
  }, [images.length])

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const goTo = (idx: number) => {
    setSlideIdx(idx)
    stopAutoSlide()
  }

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSlideIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    stopAutoSlide()
  }

  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSlideIdx((prev) => (prev + 1) % images.length)
    stopAutoSlide()
  }

  const currentSrc = images[slideIdx]
  const isVideo = currentSrc.endsWith('.mp4') || currentSrc.endsWith('.webm') || currentSrc.endsWith('.gif')

  return (
    <div
      className={`group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 overflow-hidden rounded-2xl transition-shadow hover:shadow-xl ${className}`}
      onMouseEnter={() => { setHovered(true); startAutoSlide() }}
      onMouseLeave={() => { setHovered(false); stopAutoSlide(); setSlideIdx(0) }}
    >
      {/* Image Section - 1:1 Square */}
      <div className="relative w-full aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${i === slideIdx ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={src}
              alt={`${title} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}

        {/* Video play indicator */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <svg className="h-6 w-6 text-neutral-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Like / Wishlist button */}
        <button className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-700">
          <svg className="h-5 w-5 text-neutral-600 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Dots indicator */}
        {hovered && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i) }}
                className={`h-1.5 rounded-full transition-all ${
                  i === slideIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation arrows */}
        {hovered && images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white dark:bg-neutral-800/80"
            >
              <svg className="h-4 w-4 text-neutral-700 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white dark:bg-neutral-800/80"
            >
              <svg className="h-4 w-4 text-neutral-700 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Text Section - Increased Padding */}
      <Link href={`/baker/${id}`} className="block p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge color="orange">{vendorName}</Badge>
        </div>
        <h2 className="text-base font-semibold text-neutral-900 capitalize dark:text-white leading-snug">
          <span className="line-clamp-1">{title}</span>
        </h2>
        <div className="mt-1.5 flex items-center gap-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <HugeiconsIcon icon={Location06Icon} size={14} color="currentColor" strokeWidth={1.5} />
          {deliveryAreas.slice(0, 2).join(', ')}
          {deliveryAreas.length > 2 && <span className="text-xs">+{deliveryAreas.length - 2} more</span>}
        </div>
        <div className="mt-3 w-12 border-b border-neutral-100 dark:border-neutral-800" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold">
            LKR {price.toLocaleString()}
          </span>
          {!!rating && <StartRating reviewCount={reviewsCount} point={rating} />}
        </div>
      </Link>
    </div>
  )
}

export default CakeCard
