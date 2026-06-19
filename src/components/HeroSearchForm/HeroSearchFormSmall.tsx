'use client'

import clsx from 'clsx'
import { CakeSearchForm } from './CakeSearchForm'

const HeroSearchFormSmall = ({ className }: { className?: string; initTab?: string }) => {
  return (
    <div className={clsx('hero-search-form-sm', className)}>
      <CakeSearchForm formStyle={'small'} />
    </div>
  )
}

export default HeroSearchFormSmall
