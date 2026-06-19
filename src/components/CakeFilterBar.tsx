'use client'

import { PriceRangeSlider } from '@/components/PriceRangeSlider'
import { ChevronDownIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'

export interface FilterState {
  area: string
  sortBy: 'latest' | 'popular' | 'price-low' | 'price-high'
  minRating: number
  priceRange: [number, number]
}

interface Props {
  allAreas: string[]
  onChange: (filters: FilterState) => void
  floating?: boolean
}

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
] as const

const RATING_OPTIONS = [0, 3, 3.5, 4, 4.5]

function HoverDropdown({
  label,
  icon,
  children,
  align = 'left',
  className = '',
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className={`relative ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm font-medium text-neutral-700 backdrop-blur-sm hover:bg-white hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800/90 dark:text-neutral-300 dark:hover:bg-neutral-800">
        {icon}
        {label}
        <ChevronDownIcon className="h-3.5 w-3.5 text-neutral-400" />
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 w-48 rounded-xl bg-white/95 p-2 shadow-lg ring-1 ring-black/5 backdrop-blur-md dark:bg-neutral-800/95 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default function CakeFilterBar({ allAreas, onChange, floating = false }: Props) {
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

  const bar = (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        floating
          ? 'border-white/40 bg-white/80 shadow-lg backdrop-blur-xl dark:border-neutral-700/40 dark:bg-neutral-900/80'
          : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Left group: location dropdown + sort + rating */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location - Dropdown */}
          <HoverDropdown
            label={filters.area}
            icon={<MapPinIcon className="h-4 w-4 text-neutral-500" />}
          >
            <div className="max-h-56 overflow-y-auto space-y-0.5">
              {allAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => update({ area })}
                  className={`flex w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    filters.area === area
                      ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-white'
                      : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </HoverDropdown>

          {/* Sort By */}
          <HoverDropdown
            label={SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label || 'Sort'}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            }
          >
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
          </HoverDropdown>

          {/* Rating */}
          <HoverDropdown
            label={filters.minRating > 0 ? `${filters.minRating}+` : 'Rating'}
            icon={
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
          >
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
          </HoverDropdown>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => update({ area: 'All', sortBy: 'popular', minRating: 0, priceRange: [1000, 25000] })}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Clear ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Right: Price Slider */}
        <div className={`ml-auto flex items-center gap-3 rounded-xl px-4 py-2 ${
          floating ? 'bg-white/70 dark:bg-neutral-800/70' : 'bg-neutral-50 dark:bg-neutral-800'
        }`}>
          <svg className="h-4 w-4 shrink-0 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
          <span className="w-28 shrink-0 text-sm font-medium tabular-nums text-neutral-700 dark:text-neutral-300">
            LKR {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
          </span>
          <div className="w-28">
            <PriceRangeSlider
              min={1000}
              max={25000}
              name=""
              showTitle={false}
              inline
              defaultValue={filters.priceRange}
              onChange={(value) => {
                if (value.length === 2) update({ priceRange: [value[0], value[1]] })
              }}
            />
          </div>
        </div>
      </div>

      {/* Active filter chips */}
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

  if (floating) {
    return (
      <div className="sticky top-4 z-30 -mx-2 px-2">
        {bar}
      </div>
    )
  }

  return bar
}
