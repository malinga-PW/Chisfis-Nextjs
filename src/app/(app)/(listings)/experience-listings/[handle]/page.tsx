import { getListingReviews } from '@/data/data'
import { getExperienceListingByHandle } from '@/data/listings'
import { Divider } from '@/shared/divider'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import CakeHeaderGallery from '../../components/CakeHeaderGallery'
import CakeOrderWidget from '../../components/CakeOrderWidget'
import SectionDateRange from '../../components/SectionDateRange'
import SectionHeader from '../../components/SectionHeader'
import { SectionHeading } from '../../components/SectionHeading'
import SectionHost from '../../components/SectionHost'
import SectionListingReviews from '../../components/SectionListingReviews'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const listing = await getExperienceListingByHandle(handle)

  if (!listing) {
    return {
      title: 'Listing not found',
      description: 'The listing you are looking for does not exist.',
    }
  }

  return {
    title: 'Hostlanka Business - Custom Cake Vendor',
    description: 'Custom cakes and pastries crafted with love in Athurugiriya, Colombo.',
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const listing = await getExperienceListingByHandle(handle)
  if (!listing?.id) {
    return redirect('/experience-categories/all')
  }
  const {
    host,
    reviewCount,
    reviewStart,
  } = listing
  const reviews = (await getListingReviews(handle)).slice(0, 3)

  const FLAVORS = [
    'Chocolate Truffle',
    'Vanilla Bean',
    'Red Velvet',
    'Fruit & Nut',
    'Lemon Zest',
    'Coffee Caramel',
  ]

  const ICING_TYPES = [
    'Buttercream',
    'Fondant',
    'Whipped Cream',
    'Cream Cheese Frosting',
    'Ganache',
    'Royal Icing',
  ]

  const CUSTOM_DESIGNS = [
    'Birthday cakes with photo printing',
    'Wedding tier cakes',
    'Theme-based sculpted cakes',
    'Cupcake towers for events',
    'Semi-naked / rustic cakes',
    'Sugar flower decorations',
  ]

  const renderSectionHeader = () => {
    return (
      <SectionHeader
        address="Athurugiriya area, Colombo"
        host={host}
        listingCategory="Cake Vendor"
        reviewCount={reviewCount}
        reviewStart={reviewStart}
        title="Hostlanka Business"
      >
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <span className="text-sm">Custom Cakes &amp; Pastries</span>
        </div>
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <span className="text-sm">Delivery across Colombo</span>
        </div>
      </SectionHeader>
    )
  }

  const renderCakeSampleIdeas = () => {
    return (
      <div className="listingSection__wrap">
        <SectionHeading>Cake Sample Ideas &amp; Order Form</SectionHeading>
        <Divider className="w-14!" />

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-white">Available Flavors</h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-neutral-700 sm:grid-cols-2 dark:text-neutral-300">
              {FLAVORS.map((flavor) => (
                <div key={flavor} className="flex items-center gap-x-3">
                  <CheckCircleIcon className="mt-px h-5 w-5 shrink-0 text-green-500" />
                  <span>{flavor}</span>
                </div>
              ))}
            </div>
          </div>

          <Divider className="w-14!" />

          <div>
            <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-white">Icing / Frosting Types</h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-neutral-700 sm:grid-cols-2 dark:text-neutral-300">
              {ICING_TYPES.map((icing) => (
                <div key={icing} className="flex items-center gap-x-3">
                  <CheckCircleIcon className="mt-px h-5 w-5 shrink-0 text-green-500" />
                  <span>{icing}</span>
                </div>
              ))}
            </div>
          </div>

          <Divider className="w-14!" />

          <div>
            <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-white">Custom Design Options</h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-neutral-700 sm:grid-cols-2 dark:text-neutral-300">
              {CUSTOM_DESIGNS.map((design) => (
                <div key={design} className="flex items-center gap-x-3">
                  <CheckCircleIcon className="mt-px h-5 w-5 shrink-0 text-green-500" />
                  <span>{design}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSpecialties = () => {
    return (
      <div className="listingSection__wrap">
        <SectionHeading>Specialties &amp; Hygiene Standards</SectionHeading>
        <Divider className="w-14!" />

        <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 lg:grid-cols-2 dark:text-neutral-300">
          <div className="flex items-center gap-x-3">
            <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
            <span>Eggless options available</span>
          </div>
          <div className="flex items-center gap-x-3">
            <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
            <span>Gluten-free cakes on request</span>
          </div>
          <div className="flex items-center gap-x-3">
            <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
            <span>Halal-certified ingredients</span>
          </div>
          <div className="flex items-center gap-x-3">
            <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
            <span>Hygiene-rated kitchen</span>
          </div>
          <div className="flex items-center gap-x-3">
            <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
            <span>Freshly baked on order date</span>
          </div>
          <div className="flex items-center gap-x-3">
            <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-green-500" />
            <span>Free consultation for custom designs</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CakeHeaderGallery />

      <main className="relative z-1 mt-10 flex flex-col gap-8 lg:flex-row xl:gap-10">
        <div className="flex w-full flex-col gap-y-8 lg:w-3/5 xl:w-[64%] xl:gap-y-10">
          {renderSectionHeader()}
          {renderCakeSampleIdeas()}
          {renderSpecialties()}
          <SectionDateRange />
        </div>

        <div className="grow">
          <div className="sticky top-5">
            <CakeOrderWidget />
          </div>
        </div>
      </main>

      <Divider className="my-16" />

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="w-full lg:w-4/9 xl:w-1/3">
            <SectionHost {...host} />
          </div>
          <div className="w-full lg:w-2/3">
            <SectionListingReviews reviewCount={reviewCount} reviewStart={reviewStart} reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
