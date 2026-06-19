'use client'

import clsx from 'clsx'
import Slider from 'rc-slider'
import { useState } from 'react'

export const PriceRangeSlider = ({
  min,
  max,
  name = 'Price Range',
  className,
  onChange,
  defaultValue,
  inputMaxName = 'price_max',
  inputMinName = 'price_min',
  showTitle = true,
  inline = false,
}: {
  min: number
  max: number
  name?: string
  className?: string
  onChange?: (value: number[]) => void
  defaultValue?: number[]
  inputMaxName?: string
  inputMinName?: string
  showTitle?: boolean
  inline?: boolean
}) => {
  const [rangePrices, setRangePrices] = useState<number[]>([defaultValue?.[0] ?? min, defaultValue?.[1] ?? max])

  if (inline) {
    return (
      <div className={clsx('relative', className)}>
        <Slider
          range
          min={min}
          max={max}
          step={100}
          value={rangePrices}
          allowCross={false}
          onChange={(value) => {
            const newRange = value as [number, number]
            setRangePrices(newRange)
            onChange?.(newRange)
          }}
        />
        <input type="hidden" name={inputMinName} value={rangePrices[0]} />
        <input type="hidden" name={inputMaxName} value={rangePrices[1]} />
      </div>
    )
  }

  return (
    <div className={clsx('relative flex flex-col gap-y-6', className)}>
      <div className="flex flex-col gap-y-5">
        {showTitle && <p className="font-medium">{name}</p>}
        <div className="px-2">
          <Slider
            range
            min={min}
            max={max}
            step={100}
            value={rangePrices}
            allowCross={false}
            onChange={(value) => {
              const newRange = value as [number, number]
              setRangePrices(newRange)
              onChange?.(newRange)
            }}
          />
        </div>
      </div>

      <div className="flex justify-between gap-x-5">
        <div className="flex-1">
          <div className="ps-4 text-xs/6 text-neutral-700 dark:text-neutral-300">Min price</div>
          <div className="relative mt-0.5 w-full rounded-full bg-neutral-100 px-4 py-2 text-sm dark:bg-neutral-800">
            LKR {rangePrices[0].toLocaleString()}
          </div>
          <input type="hidden" name={inputMinName} value={rangePrices[0]} />
        </div>
        <div className="flex-1">
          <div className="ps-4 text-xs/6 text-neutral-700 dark:text-neutral-300">Max price</div>
          <div className="relative mt-0.5 w-full rounded-full bg-neutral-100 px-4 py-2 text-sm dark:bg-neutral-800">
            LKR {rangePrices[1].toLocaleString()}
          </div>
          <input type="hidden" name={inputMaxName} value={rangePrices[1]} />
        </div>
      </div>
    </div>
  )
}
