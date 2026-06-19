'use client'

import avatarImage from '@/images/avatars/Image-1.png'
import Avatar from '@/shared/Avatar'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  BulbChargingIcon,
  FavouriteIcon,
  Idea01Icon,
  Logout01Icon,
  Task01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ShoppingCartIcon,
  HeartIcon,
  StorefrontIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

type UserRole = 'customer' | 'baker' | 'admin'

interface Props {
  className?: string
}

const ROLE_LABELS: Record<UserRole, string> = {
  customer: 'Customer',
  baker: 'Baker',
  admin: 'Admin',
}

export default function AvatarDropdown({ className }: Props) {
  const [role, setRole] = useState<UserRole>('customer')

  return (
    <div className={className}>
      <Popover>
        <PopoverButton className="-m-1.5 flex cursor-pointer items-center justify-center rounded-full p-1.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800">
          <Avatar src={avatarImage.src} className="size-8" />
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative grid grid-cols-1 gap-6 bg-white px-6 py-7 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <Avatar src={avatarImage.src} className="size-12" />
              <div className="grow">
                <h4 className="font-semibold">Eden Smith</h4>
                <p className="mt-0.5 text-xs text-neutral-500">Los Angeles, CA</p>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-700">
              {(['customer', 'baker', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    role === r
                      ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-600 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>

            <Divider />

            {/* Customer Section */}
            {role === 'customer' && (
              <>
                <Link href="/account" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">My Orders</p>
                </Link>
                <Link href="/cart" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <ShoppingCartIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Cart</p>
                </Link>
                <Link href="/account-savelists" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HeartIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Wishlist</p>
                </Link>
                <Link href="/account" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <Cog6ToothIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Account Settings</p>
                </Link>
              </>
            )}

            {/* Baker Section */}
            {role === 'baker' && (
              <>
                <Link href="/authors/john-doe" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <StorefrontIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Vendor Dashboard</p>
                </Link>
                <Link href="/authors/john-doe" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <BuildingStorefrontIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Manage Products</p>
                </Link>
                <Link href="/account" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">View Orders</p>
                </Link>
                <Link href="/account-billing" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <CurrencyDollarIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Earnings</p>
                </Link>
              </>
            )}

            {/* Admin Section */}
            {role === 'admin' && (
              <>
                <Link href="/account" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <StorefrontIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Platform Dashboard</p>
                </Link>
                <Link href="/cakes" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <BuildingStorefrontIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Manage Bakers</p>
                </Link>
                <Link href="/account" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <Cog6ToothIcon className="h-6 w-6" />
                  </div>
                  <p className="ms-4 text-sm font-medium">Settings</p>
                </Link>
              </>
            )}

            <Divider />

            <div className="focus-visible:ring-opacity-50 -m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 dark:hover:bg-neutral-700">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Dark theme</p>
              </div>
              <SwitchDarkMode2 />
            </div>

            <Link href="#" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={BulbChargingIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Help</p>
            </Link>

            <Link href="#" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Logout01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Log out</p>
            </Link>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
