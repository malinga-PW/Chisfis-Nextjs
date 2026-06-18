import { FC } from 'react'

interface SaleOffBadgeProps {
  className?: string
  content?: string
}

const SaleOffBadge: FC<SaleOffBadgeProps> = ({ className = '', content = '-20% OFF' }) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full border border-red-100 bg-red-50 px-3 py-0.5 text-xs font-medium text-red-600 ${className}`}
    >
      {content}
    </div>
  )
}

export default SaleOffBadge
