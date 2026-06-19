'use client'

import { DeliveryMap } from '@/components/DeliveryMap'
import { Divider } from '@/shared/divider'
import { Calendar01Icon, Clock01Icon, Location01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
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

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM',
]

const CakeOrderWidget = () => {
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0])
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0])
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })
  const [deliveryTime, setDeliveryTime] = useState('10:00 AM')
  const [addressLine, setAddressLine] = useState('')
  const [lat, setLat] = useState(6.9271)
  const [lng, setLng] = useState(79.8612)

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

      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Pickup / Delivery Date & Time</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 dark:border-neutral-700">
            <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-neutral-400" />
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full border-none bg-transparent p-0 text-sm font-medium text-neutral-900 focus:ring-0 focus:outline-hidden dark:text-neutral-100"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 dark:border-neutral-700">
            <HugeiconsIcon icon={Clock01Icon} size={18} className="text-neutral-400" />
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full border-none bg-transparent p-0 text-sm font-medium text-neutral-900 focus:ring-0 focus:outline-hidden dark:text-neutral-100"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedDelivery.value === 'delivery' && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Delivery Address</h3>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 dark:border-neutral-700">
            <HugeiconsIcon icon={Location01Icon} size={18} className="text-neutral-400" />
            <input
              type="text"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Enter your delivery address"
              className="w-full border-none bg-transparent p-0 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:ring-0 focus:outline-hidden dark:text-neutral-100"
            />
          </div>
          <div className="mt-3">
            <DeliveryMap onLocationChange={(latitude, longitude) => { setLat(latitude); setLng(longitude) }} height="h-56" />
          </div>
        </div>
      )}

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
        onClick={() => alert(`Order submitted!\nDate: ${deliveryDate}\nTime: ${deliveryTime}\nWeight: ${selectedWeight.label}\nDelivery: ${selectedDelivery.label}${selectedDelivery.value === 'delivery' ? `\nAddress: ${addressLine}` : ''}\nTotal: LKR ${total.toLocaleString()}`)}
      >
        Request Order
      </button>
    </div>
  )
}

export default CakeOrderWidget
