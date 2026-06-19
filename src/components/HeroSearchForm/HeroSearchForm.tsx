import { CakeSearchForm } from './CakeSearchForm'
import clsx from 'clsx'

const HeroSearchForm = ({ className }: { className?: string; initTab?: string }) => {
  return (
    <div className={clsx('hero-search-form', className)}>
      <CakeSearchForm formStyle={'default'} />
    </div>
  )
}

export default HeroSearchForm
