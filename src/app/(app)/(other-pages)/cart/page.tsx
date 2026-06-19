'use client'

import { DEMO_CAKES_DATA } from '@/data/cakes'
import { Divider } from '@/shared/divider'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
  const [cartItems, setCartItems] = useState(
    DEMO_CAKES_DATA.slice(0, 2).map((cake) => ({ ...cake, quantity: 1, selectedWeight: '2 kg', totalPrice: cake.price + 800 })),
  )

  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

  if (cartItems.length === 0) {
    return (
      <div className="container mt-20 text-center">
        <h1 className="text-2xl font-semibold">Your Cart is Empty</h1>
        <p className="mt-2 text-neutral-500">Browse cakes and add your favorites to cart.</p>
        <Link href="/cakes" className="mt-6 inline-block rounded-full bg-neutral-900 px-8 py-3 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
          Browse Cakes
        </Link>
      </div>
    )
  }

  return (
    <div className="container mt-10 mb-24">
      <h1 className="text-2xl font-semibold sm:text-3xl">Your Cart</h1>
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image src={item.featuredImage} alt={item.vendorName} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1">
                <Link href={`/baker/${item.id}`} className="font-semibold hover:text-neutral-600">{item.vendorName}</Link>
                <p className="text-sm text-neutral-500">{item.title}</p>
                <p className="mt-1 text-sm">Weight: {item.selectedWeight} | Delivery: LKR 800</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">LKR {item.totalPrice.toLocaleString()}</p>
                <button
                  onClick={() => setCartItems(cartItems.filter((ci) => ci.id !== item.id))}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full shrink-0 rounded-2xl border border-neutral-200 p-6 lg:w-80 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <Divider className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>Included</span>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>LKR {total.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
