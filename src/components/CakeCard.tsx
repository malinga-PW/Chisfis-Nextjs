import StartRating from '@/components/StartRating'
import { Badge } from '@/shared/Badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { Location06Icon } from '@hugeicons/core-free-icons'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { TCakeListing } from '@/data/cakes'

interface CakeCardProps {
  className?: string
  data: TCakeListing
}

const CakeCard: FC<CakeCardProps> = ({ className = '', data }) => {
  const { vendorName, title, deliveryAreas, price, rating, reviewsCount, featuredImage, id } = data

  return (
    <div
      className={`group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 overflow-hidden rounded-2xl transition-shadow hover:shadow-xl ${className}`}
    >
      <div className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden">
        <Image
          src={featuredImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1025px) 100vw, 25vw"
        />
      </div>
      <Link href={`/baker/${id}`} className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge color="orange">{vendorName}</Badge>
          </div>
          <h2 className="text-base font-semibold text-neutral-900 capitalize dark:text-white">
            <span className="line-clamp-1">{title}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
            <HugeiconsIcon icon={Location06Icon} size={16} color="currentColor" strokeWidth={1.5} />
            {deliveryAreas.slice(0, 2).join(', ')}
            {deliveryAreas.length > 2 && <span className="text-xs">+{deliveryAreas.length - 2} more</span>}
          </div>
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">
            LKR {price.toLocaleString()}
          </span>
          {!!rating && <StartRating reviewCount={reviewsCount} point={rating} />}
        </div>
      </Link>
    </div>
  )
}

export default CakeCard
