'use client'

import { DeliveryMap } from '@/components/DeliveryMap'
import ModalSelectDate from '@/components/ModalSelectDate'
import T from '@/utils/getT'
import { Calendar01Icon, Clock01Icon, Location01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM',
]

const YourTrip = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [deliveryTime, setDeliveryTime] = useState('10:00 AM')
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('delivery')
  const [addressLine, setAddressLine] = useState('')
  const [lat, setLat] = useState(6.9271)
  const [lng, setLng] = useState(79.8612)

  return (
    <div>
      <h3 className="text-2xl font-semibold">Your Order Details</h3>
      <div className="z-10 mt-6 flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700">
        <ModalSelectDate
          onChange={(dates) => {
            const [start] = dates
            setStartDate(start)
          }}
          triggerButton={({ openModal }) => (
            <button
              onClick={openModal}
              className="flex flex-1 justify-between gap-x-5 p-5 text-start hover:bg-neutral-50 focus-visible:outline-hidden dark:hover:bg-neutral-800"
              type="button"
            >
              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">{'Delivery Date'}</span>
                <span className="mt-1.5 text-lg font-semibold">
                  {startDate
                    ? startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                    : 'Select date'}
                </span>
              </div>
              <PencilSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
            </button>
          )}
        />

        <div className="flex flex-1 gap-x-5 p-5 text-start">
          <div className="flex w-full flex-col">
            <span className="text-sm text-neutral-400">Delivery Time</span>
            <div className="mt-1.5 flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} size={20} className="shrink-0 text-neutral-400" />
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-lg font-semibold text-neutral-900 focus:ring-0 focus:outline-hidden dark:text-neutral-100"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="z-10 mt-4 flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700">
        <div className="p-5">
          <span className="text-sm text-neutral-400">Delivery Method</span>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setDeliveryOption('pickup')}
              className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${
                deliveryOption === 'pickup'
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300'
              }`}
            >
              Store Pickup
            </button>
            <button
              onClick={() => setDeliveryOption('delivery')}
              className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${
                deliveryOption === 'delivery'
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300'
              }`}
            >
              Doorstep Delivery
            </button>
          </div>
        </div>

        {deliveryOption === 'delivery' && (
          <div className="p-5">
            <span className="text-sm text-neutral-400">Delivery Address</span>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 dark:border-neutral-700">
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
      </div>

      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Click on the pencil icon to change your delivery date.
      </p>

      <input type="hidden" name="deliveryDate" value={startDate ? startDate.toISOString() : ''} />
      <input type="hidden" name="deliveryTime" value={deliveryTime} />
      <input type="hidden" name="deliveryOption" value={deliveryOption} />
      <input type="hidden" name="deliveryAddress" value={addressLine} />
      <input type="hidden" name="deliveryLat" value={lat} />
      <input type="hidden" name="deliveryLng" value={lng} />
    </div>
  )
}

export default YourTrip
