'use client'

import BgGlassmorphism from '@/components/BgGlassmorphism'
import CakeCard from '@/components/CakeCard'
import CakeFilterBar from '@/components/CakeFilterBar'
import type { FilterState } from '@/components/CakeFilterBar'
import HeadingWithSub from '@/shared/Heading'
import { DEMO_CAKES_DATA } from '@/data/cakes'
import type { TCakeListing } from '@/data/cakes'
import { useState, useMemo } from 'react'

const ALL_AREAS = ['All', 'Athurugiriya', 'Kiribathgoda', 'Rajanganaya', 'Mulleriyawa', 'Malabe', 'Colombo']

function filterCakes(cakes: TCakeListing[], filters: FilterState): TCakeListing[] {
  let result = [...cakes]

  if (filters.area !== 'All') {
    result = result.filter((c) => c.deliveryAreas.includes(filters.area))
  }

  if (filters.minRating > 0) {
    result = result.filter((c) => c.rating >= filters.minRating)
  }

  result = result.filter((c) => c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1])

  switch (filters.sortBy) {
    case 'popular':
      result.sort((a, b) => b.reviewsCount - a.reviewsCount)
      break
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'latest':
    default:
      break
  }

  return result
}

function CakesPage() {
  const [filters, setFilters] = useState<FilterState>({
    area: 'All',
    sortBy: 'popular',
    minRating: 0,
    priceRange: [1000, 25000],
  })

  const filteredCakes = useMemo(() => filterCakes(DEMO_CAKES_DATA, filters), [filters])

  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">
        {/* Hero */}
        <div
          className="relative flex min-h-[60vh] items-center justify-center rounded-3xl bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 rounded-3xl bg-black/40" />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Discover Custom Cakes</h1>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg">
              Find the perfect custom cake for any occasion in Colombo
            </p>
          </div>
        </div>

        {/* Popular Bakers Section */}
        <div>
          <HeadingWithSub
            isCenter
            subheading="Handpicked bakers ready to deliver to your doorstep"
          >
            Popular Bakers in Your Area
          </HeadingWithSub>

          {/* Advanced Filter Bar */}
          <div className="mt-8">
            <CakeFilterBar allAreas={ALL_AREAS} onChange={setFilters} floating />
          </div>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3 xl:grid-cols-3">
            {filteredCakes.length > 0 ? (
              filteredCakes.map((cake) => (
                <CakeCard key={cake.id} data={cake} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-neutral-500">
                No cakes match your filters. Try adjusting your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default CakesPage
