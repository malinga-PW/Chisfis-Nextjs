'use client'

import { FC } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM',
  '08:00 PM',
]

interface Props {
  className?: string
  label?: string
  value?: string
  onChange?: (time: string) => void
  fieldStyle?: 'default' | 'small'
}

export const TimePickerField: FC<Props> = ({
  className = 'flex-1',
  label = 'Delivery Time',
  value = '10:00 AM',
  onChange,
  fieldStyle = 'default',
}) => {
  return (
    <div className={`group relative z-10 flex ${className}`}>
      <div className={`relative z-10 w-full cursor-pointer flex items-center gap-x-3 text-start ${fieldStyle === 'default' ? 'px-7 py-4 xl:px-8 xl:py-6' : 'py-3 px-7 xl:px-8'}`}>
        <ClockIcon className="size-5 text-neutral-300 lg:size-7 dark:text-neutral-400" />
        <div className="flex-1 text-start">
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="block w-full truncate border-none bg-transparent p-0 font-semibold text-neutral-900 focus:ring-0 focus:outline-hidden dark:text-neutral-100"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot} className="text-neutral-900 dark:text-neutral-100">
                {slot}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-sm leading-none font-light text-neutral-400">{label}</span>
        </div>
      </div>
    </div>
  )
}
