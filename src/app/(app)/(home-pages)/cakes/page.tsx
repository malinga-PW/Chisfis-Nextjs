'use client'

import BgGlassmorphism from '@/components/BgGlassmorphism'
import CakeCard from '@/components/CakeCard'
import HeadingWithSub from '@/shared/Heading'
import { DEMO_CAKES_DATA } from '@/data/cakes'
import { useState } from 'react'

const ALL_AREAS = ['All', 'Colombo 03', 'Colombo 07', 'Nugegoda', 'Dehiwala', 'Maharagama']

function CakesPage() {
  const [activeArea, setActiveArea] = useState('All')

  const filtered =
    activeArea === 'All'
      ? DEMO_CAKES_DATA
      : DEMO_CAKES_DATA.filter((c) => c.deliveryAreas.includes(activeArea))

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

          {/* Area Filter */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {ALL_AREAS.map((area) => (
              <button
                key={area}
                onClick={() => setActiveArea(area)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeArea === area
                    ? 'bg-neutral-900 text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((cake) => (
              <CakeCard key={cake.id} data={cake} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default CakesPage
