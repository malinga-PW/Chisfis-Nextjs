'use client'

import CakeOrderWidget from '@/app/(app)/(listings)/components/CakeOrderWidget'
import { DeliveryMap } from '@/components/DeliveryMap'
import { DEMO_CAKES_DATA } from '@/data/cakes'
import { Divider } from '@/shared/divider'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

const FLAVORS = [
  'Chocolate Truffle', 'Vanilla Bean', 'Red Velvet',
  'Fruit & Nut', 'Lemon Zest', 'Coffee Caramel',
]

const ICING_TYPES = [
  'Buttercream', 'Fondant', 'Whipped Cream',
  'Cream Cheese Frosting', 'Ganache', 'Royal Icing',
]

export default function BakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const baker = DEMO_CAKES_DATA.find((b) => b.id === id)
  if (!baker) notFound()

  return (
    <div className="container mt-10">
      <Link href="/cakes" className="mb-4 inline-flex text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
        &larr; Back to all bakers
      </Link>

      <div className="relative mb-8 aspect-[3/1] w-full overflow-hidden rounded-3xl">
        <Image src={baker.featuredImage} alt={baker.vendorName} fill className="object-cover" sizes="100vw" />
      </div>

      <main className="relative z-1 mt-10 flex flex-col gap-8 lg:flex-row xl:gap-10">
        <div className="flex w-full flex-col gap-y-8 lg:w-3/5 xl:w-[64%] xl:gap-y-10">
          <div className="listingSection__wrap">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-lg font-bold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                {baker.vendorName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-semibold sm:text-3xl">{baker.vendorName}</h1>
                <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                  <MapPinIcon className="h-4 w-4" />
                  {baker.subArea}, {baker.town}
                </div>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-300">{baker.title}</p>

            <div className="flex flex-wrap gap-2">
              {baker.categories.map((cat) => (
                <span key={cat} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div><span className="font-semibold">{baker.rating}</span> ({baker.reviewsCount} reviews)</div>
              <div><span className="font-semibold">{baker.minOrderNotice}</span> min. notice</div>
              {baker.isEgglessAvailable && <div className="text-green-600">Eggless available</div>}
              {baker.isGlutenFreeAvailable && <div className="text-green-600">Gluten-free available</div>}
              {baker.isHalalCertified && <div className="text-green-600">Halal certified</div>}
            </div>
          </div>

          <div className="listingSection__wrap">
            <h2 className="text-xl font-semibold">Specialties</h2>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {baker.specialties.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div className="listingSection__wrap">
            <h2 className="text-xl font-semibold">Available Flavors</h2>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {FLAVORS.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="listingSection__wrap">
            <h2 className="text-xl font-semibold">Icing / Frosting Types</h2>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {ICING_TYPES.map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="listingSection__wrap">
            <h2 className="text-xl font-semibold">Location & Delivery</h2>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                <p className="text-xs text-neutral-500">Delivery Mode</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 dark:border-neutral-700">
                  <span className={`h-2.5 w-2.5 rounded-full ${baker.deliveryMode === 'radius' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                  <span className="font-medium">{baker.deliveryMode === 'radius' ? 'Radius Delivery' : 'Area Delivery'}</span>
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  {baker.deliveryMode === 'radius'
                    ? `${baker.deliveryRadiusKm || 10} km radius from baker location`
                    : baker.deliveryAreas.join(', ')}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                <p className="text-xs text-neutral-500">Map Preview</p>
                <div className="mt-2 overflow-hidden rounded-lg">
                  <DeliveryMap
                    initialLat={baker.lat}
                    initialLng={baker.lng}
                    draggable={false}
                    showLocateButton={false}
                    height="h-44"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grow">
          <div className="sticky top-5">
            <CakeOrderWidget
              bakerName={baker.vendorName}
              vendorLat={baker.lat}
              vendorLng={baker.lng}
              vendorDeliveryMode={baker.deliveryMode}
              vendorDeliveryAreas={baker.deliveryAreas}
              vendorDeliveryRadiusKm={baker.deliveryRadiusKm}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
