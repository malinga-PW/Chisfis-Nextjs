'use client'

import { DeliveryMap } from '@/components/DeliveryMap'
import { useNotifications } from '@/contexts/NotificationContext'
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

interface Props {
  bakerName?: string
  onOrderSuccess?: () => void
}

const CakeOrderWidget = ({ bakerName = 'Baker', onOrderSuccess }: Props) => {
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
  const [showModal, setShowModal] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [showBuyerForm, setShowBuyerForm] = useState(false)
  const [buyerName, setBuyerName] = useState('')
  const [buyerMobile, setBuyerMobile] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerSaved, setBuyerSaved] = useState(false)

  const { dispatchNotification } = useNotifications()

  const subtotal = selectedWeight.price
  const deliveryFee = selectedDelivery.fee
  const total = subtotal + deliveryFee

  const handleRequestOrder = () => {
    if (!buyerSaved) {
      setShowBuyerForm(true)
      return
    }
    const ref = `ORD-${Date.now().toString(36).toUpperCase()}`
    setOrderRef(ref)
    setShowModal(true)

    const deliveryDesc = selectedDelivery.value === 'pickup' ? 'Store Pickup' : addressLine || 'Doorstep Delivery'
    dispatchNotification({
      name: bakerName,
      description: `New Order Received! ${buyerName || 'A buyer'} placed a ${selectedWeight.label} cake for ${deliveryDate}. Delivery: ${deliveryDesc}.`,
      time: 'Just now',
      href: '#',
    })
    onOrderSuccess?.()
  }

  return (
    <>
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
          onClick={handleRequestOrder}
          className="w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Request Order
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-neutral-800">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Order Submitted!</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Your order has been sent to {bakerName}. You will be notified once it is confirmed.
            </p>
            <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-700">
              <p>Order Reference: <span className="font-mono font-semibold">{orderRef}</span></p>
              <p className="mt-1">Date: {deliveryDate} at {deliveryTime}</p>
              <p>Total: LKR {total.toLocaleString()}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showBuyerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-neutral-800">
            <h3 className="text-xl font-semibold">Complete Your Profile</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Please provide your details to continue with the order.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={buyerMobile}
                  onChange={(e) => setBuyerMobile(e.target.value)}
                  placeholder="+94 XX XXX XXXX"
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                />
                <p className="mt-1 text-xs text-neutral-400">Will be used for phone verification (OTP)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email Address <span className="text-neutral-400">(optional)</span>
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowBuyerForm(false)}
                className="flex-1 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!buyerName.trim() || !buyerMobile.trim()) return
                  setBuyerSaved(true)
                  setShowBuyerForm(false)
                  handleRequestOrder()
                }}
                disabled={!buyerName.trim() || !buyerMobile.trim()}
                className="flex-1 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CakeOrderWidget
