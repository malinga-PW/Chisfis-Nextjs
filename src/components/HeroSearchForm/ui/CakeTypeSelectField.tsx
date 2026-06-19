'use client'

import { Cake01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FC } from 'react'

const CAKE_TYPES = [
  'All Types',
  'Birthday',
  'Wedding',
  'Anniversary',
  'Corporate',
  'Custom Design',
  'Cupcakes',
]

interface Props {
  className?: string
  value?: string
  onChange?: (value: string) => void
  fieldStyle?: 'default' | 'small'
}

export const CakeTypeSelectField: FC<Props> = ({
  className = 'flex-1',
  value = 'All Types',
  onChange,
  fieldStyle = 'default',
}) => {
  return (
    <div className={`group relative z-10 flex ${className}`}>
      <div className={`relative z-10 w-full cursor-pointer flex items-center gap-x-3 text-start ${fieldStyle === 'default' ? 'px-7 py-4 xl:px-8 xl:py-6' : 'py-3 px-7 xl:px-8'}`}>
        <HugeiconsIcon icon={Cake01Icon} size={24} className="text-neutral-300 dark:text-neutral-400" />
        <div className="flex-1 text-start">
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="block w-full truncate border-none bg-transparent p-0 font-semibold text-neutral-900 focus:ring-0 focus:outline-hidden dark:text-neutral-100"
          >
            {CAKE_TYPES.map((type) => (
              <option key={type} value={type} className="text-neutral-900 dark:text-neutral-100">
                {type}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-sm leading-none font-light text-neutral-400">Cake Occasion / Type</span>
        </div>
      </div>
    </div>
  )
}
