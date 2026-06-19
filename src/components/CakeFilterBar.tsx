'use client'

import { PriceRangeSlider } from '@/components/PriceRangeSlider'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export interface FilterState {
  area: string
  sortBy: 'latest' | 'popular' | 'price-low' | 'price-high'
  minRating: number
  priceRange: [number, number]
}

interface Props {
  allAreas: string[]
  onChange: (filters: FilterState) => void
}

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
] as const

const RATING_OPTIONS = [0, 3, 3.5, 4, 4.5]

export default function CakeFilterBar({ allAreas, onChange }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    area: 'All',
    sortBy: 'popular',
    minRating: 0,
    priceRange: [1000, 25000],
  })

  const update = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial }
    setFilters(next)
    onChange(next)
  }

  const activeFilterCount = [
    filters.area !== 'All',
    filters.sortBy !== 'popular',
    filters.minRating > 0,
    filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 25000,
  ].filter(Boolean).length

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Location pills */}
        <div className="flex flex-wrap items-center gap-2">
          {allAreas.map((area) => (
            <button
              key={area}
              onClick={() => update({ area })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filters.area === area
                  ? 'bg-neutral-900 text-white shadow dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Right: Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort By */}
          <Popover>
            <PopoverButton className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              {SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label || 'Sort'}
              <ChevronDownIcon className="h-3.5 w-3.5 text-neutral-400" />
            </PopoverButton>
            <PopoverPanel anchor="bottom end" className="z-50 mt-2 w-48 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 dark:bg-neutral-800">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ sortBy: opt.value })}
                  className={`flex w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    filters.sortBy === opt.value
                      ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-white'
                      : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </PopoverPanel>
          </Popover>

          {/* Rating Filter */}
          <Popover>
            <PopoverButton className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {filters.minRating > 0 ? `${filters.minRating}+` : 'Rating'}
              <ChevronDownIcon className="h-3.5 w-3.5 text-neutral-400" />
            </PopoverButton>
            <PopoverPanel anchor="bottom end" className="z-50 mt-2 w-44 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 dark:bg-neutral-800">
              {RATING_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => update({ minRating: r })}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    filters.minRating === r
                      ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-white'
                      : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  {r === 0 ? (
                    <span>Any Rating</span>
                  ) : (
                    <>
                      <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{r}+ Stars</span>
                    </>
                  )}
                </button>
              ))}
            </PopoverPanel>
          </Popover>

          {/* Price Range Popover */}
          <Popover>
            <PopoverButton className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
              LKR {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
              <ChevronDownIcon className="h-3.5 w-3.5 text-neutral-400" />
            </PopoverButton>
            <PopoverPanel anchor="bottom end" className="z-50 mt-2 w-80 rounded-xl bg-white p-5 shadow-lg ring-1 ring-black/5 dark:bg-neutral-800">
              <PriceRangeSlider
                min={1000}
                max={25000}
                name="Price Range (LKR)"
                defaultValue={filters.priceRange}
                onChange={(value) => {
                  if (value.length === 2) update({ priceRange: [value[0], value[1]] })
                }}
              />
            </PopoverPanel>
          </Popover>

          {/* Active filters indicator */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => update({ area: 'All', sortBy: 'popular', minRating: 0, priceRange: [1000, 25000] })}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span>Active:</span>
          {filters.area !== 'All' && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">{filters.area}</span>
          )}
          {filters.sortBy !== 'popular' && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
              {SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label}
            </span>
          )}
          {filters.minRating > 0 && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">{filters.minRating}+ Stars</span>
          )}
          {(filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 25000) && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
              LKR {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
