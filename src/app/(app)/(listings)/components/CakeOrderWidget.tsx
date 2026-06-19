'use client'

import { Divider } from '@/shared/divider'
import T from '@/utils/getT'
import { useState } from 'react'

const WEIGHT_OPTIONS = [
  { label: '1 kg', value: 1, price: 3500 },
  { label: '2 kg', value: 2, price: 5500 },
  { label: '3 kg', value: 3, price: 7500 },
]

const DELIVERY_OPTIONS = [
  { label: 'Store Pickup', value: 'pickup', fee: 0 },
  { label: 'Doorstep Delivery', value: 'delivery', fee: 800 },
]

const CakeOrderWidget = () => {
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0])
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0])

  const subtotal = selectedWeight.price
  const deliveryFee = selectedDelivery.fee
  const total = subtotal + deliveryFee

  return (
    <div className="listingSection__wrap sm:shadow-xl">
      <div className="flex justify-between">
        <span className="text-3xl font-semibold">
          LKR {selectedWeight.price.toLocaleString()}
          <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">/{selectedWeight.label}</span>
        </span>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Cake Weight</h3>
        <div className="flex gap-2">
          {WEIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedWeight(opt)}
              className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                selectedWeight.value === opt.value
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Delivery Options</h3>
        <div className="flex gap-2">
          {DELIVERY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedDelivery(opt)}
              className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                selectedDelivery.value === opt.value
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Cake ({selectedWeight.label})</span>
          <span>LKR {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee.toLocaleString()}`}</span>
        </div>
        <Divider />
        <div className="flex justify-between text-base font-semibold text-neutral-900 dark:text-neutral-100">
          <span>Total</span>
          <span>LKR {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
        <p className="font-medium">Payment on Pickup / Delivery</p>
        <p className="mt-0.5 text-xs">Pay by cash or card when you receive your order</p>
      </div>

      <button
        className="w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        onClick={() => alert('Order request submitted!')}
      >
        Request Order
      </button>
    </div>
  )
}

export default CakeOrderWidget
