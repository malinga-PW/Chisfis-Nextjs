'use client'

import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/contexts/AuthContext'
import avatarImage from '@/images/avatars/Image-1.png'
import Avatar from '@/shared/Avatar'
import { Button } from '@/shared/Button'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  Award04Icon,
  BulbChargingIcon,
  FavouriteIcon,
  Idea01Icon,
  Location01Icon,
  Logout01Icon,
  Task01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface Props {
  className?: string
}

const ROLE_LABELS: Record<UserRole, string> = {
  BUYER: 'Customer',
  SELLER: 'Baker',
  SUPER_ADMIN: 'Admin',
}

export default function AvatarDropdown({ className }: Props) {
  const { user, switchRole, logout } = useAuth()

  if (!user) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <Button color="light" href="/login" className="py-1.75! px-4! text-sm!">
            Sign In
          </Button>
          <Button color="primary" href="/signup" className="py-1.75! px-4! text-sm!">
            Register
          </Button>
        </div>
      </div>
    )
  }

  const role = user.role

  return (
    <div className={className}>
      <Popover>
        <PopoverButton className="-m-1.5 flex cursor-pointer items-center justify-center rounded-full p-1.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800">
          <Avatar src={user.avatar || avatarImage.src} className="size-8" />
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
              <Avatar src={user.avatar || avatarImage.src} className="size-12" />
              <div className="grow">
                <h4 className="font-semibold">{user.name}</h4>
                <p className="mt-0.5 text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-700">
              {(['BUYER', 'SELLER', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
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

            {/* Customer / BUYER links */}
            {role === 'BUYER' && (
              <>
                <Link href="/user/orders" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">My Orders</p>
                </Link>
                <Link href="/cart" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={Location01Icon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Cart</p>
                </Link>
                <Link href="/user/settings" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Account Settings</p>
                </Link>
              </>
            )}

            {/* Seller / SELLER links */}
            {role === 'SELLER' && (
              <>
                <Link href="/vendor/dashboard" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Vendor Dashboard</p>
                </Link>
                <Link href="/vendor/profile" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Profile Settings</p>
                </Link>
                <Link href="/vendor/products" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Manage Products</p>
                </Link>
                <Link href="/vendor/orders" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={FavouriteIcon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">View Orders</p>
                </Link>
                <Link href="/vendor/dashboard" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={Award04Icon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Earnings</p>
                </Link>
              </>
            )}

            {/* Admin / SUPER_ADMIN links */}
            {role === 'SUPER_ADMIN' && (
              <>
                <Link href="/admin/dashboard" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Platform Dashboard</p>
                </Link>
                <Link href="/admin/users" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Manage Users</p>
                </Link>
                <Link href="/admin/settings" className="-m-3 flex items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={FavouriteIcon} size={24} strokeWidth={1.5} />
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

            <button onClick={logout} className="-m-3 flex w-full items-center rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Logout01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium text-left">Log out</p>
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
