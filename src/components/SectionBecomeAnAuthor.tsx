'use client'

import rightImgDemo from '@/images/BecomeAnAuthorImg.png'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Heading, Subheading } from '@/shared/Heading'
import Logo from '@/shared/Logo'
import T from '@/utils/getT'
import Image from 'next/image'
import { FC, useState } from 'react'

interface SectionBecomeAnAuthorProps {
  className?: string
  rightImg?: string
  heading?: string
  subHeading?: string
}

const SectionBecomeAnAuthor: FC<SectionBecomeAnAuthorProps> = ({
  className = '',
  rightImg = rightImgDemo,
  heading = 'List your bakery with us.',
  subHeading = 'With Chisfis, reach thousands of customers looking for custom cakes in your area. Showcase your creations and grow your baking business.',
}) => {
  const [showModal, setShowModal] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'BAKER2026') {
      setCouponMessage({
        type: 'success',
        text: 'Coupon applied! Enjoy 0% commission for your first month.',
      })
    } else if (couponCode.trim()) {
      setCouponMessage({
        type: 'error',
        text: 'Invalid coupon code. Please try again.',
      })
    }
  }

  return (
    <>
      <div className={`relative flex flex-col items-center lg:flex-row ${className}`}>
        <div className="mb-16 shrink-0 lg:me-10 lg:mb-0 lg:w-2/5">
          <Logo />

          <Heading level={2} className="mt-6 sm:mt-11">
            {heading}
          </Heading>
          <Subheading className="mt-6">{subHeading}</Subheading>

          <ButtonPrimary className="mt-6 sm:mt-11" onClick={() => setShowModal(true)}>
            {'Become a Baker'}
          </ButtonPrimary>
        </div>
        <div className="grow">
          <Image alt="choose us" src={rightImg} />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-neutral-800">
            <h3 className="text-xl font-semibold">Baker Registration</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Fill in your details to start selling cakes on Chisfis.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Baker Name</label>
                <input type="text" placeholder="Your bakery name" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                <input type="email" placeholder="you@example.com" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone</label>
                <input type="tel" placeholder="+94 XX XXX XXXX" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Promotional / Invitation Coupon Code
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponMessage(null) }}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`mt-1 text-sm ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setCouponMessage(null); setCouponCode('') }}
                className="flex-1 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button className="flex-1 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SectionBecomeAnAuthor
