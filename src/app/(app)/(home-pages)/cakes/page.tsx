import BgGlassmorphism from '@/components/BgGlassmorphism'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { CakeIcon } from '@/components/Icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'
import heroImage from '@/images/hero-right-experience.png'

export const metadata: Metadata = {
  title: 'Cakes',
  description: 'Find the perfect custom cake',
}

async function CakesPage() {
  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">
        <HeroSectionWithSearchForm1
          heading="Discover Custom Cakes"
          image={heroImage}
          imageAlt="cakes"
          description={
            <>
              <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400">
                Find the perfect custom cake for any occasion.
              </p>
              <ButtonPrimary href={'/cakes'} className="sm:text-base/normal">
                Browse cakes
              </ButtonPrimary>
            </>
          }
        />
      </div>
    </main>
  )
}

export default CakesPage
