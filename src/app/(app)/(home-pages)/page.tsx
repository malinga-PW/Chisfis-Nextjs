import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import CakeCard from '@/components/CakeCard'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import HeroSearchForm from '@/components/HeroSearchForm/HeroSearchForm'
import SectionBecomeAnAuthor from '@/components/SectionBecomeAnAuthor'
import SectionClientSay from '@/components/SectionClientSay'
import SectionHowItWork from '@/components/SectionHowItWork'
import SectionOurFeatures from '@/components/SectionOurFeatures'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { DEMO_CAKES_DATA } from '@/data/cakes'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import Heading from '@/shared/Heading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Cakes Marketplace',
  description: 'Find the perfect custom cake in your area',
}

const heroImage = {
  src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
  width: 1200,
  height: 900,
}

async function Page() {
  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />

      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">
        <HeroSectionWithSearchForm1
          heading="Find the Perfect Custom Cake in Your Area"
          image={heroImage}
          imageAlt="Delicious custom cakes"
          searchForm={<HeroSearchForm initTab="Cakes" />}
          description={
            <>
              <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400">
                Browse local bakers, customize your cake, and enjoy fast delivery to your doorstep.
              </p>
              <ButtonPrimary href={'/cakes'} className="sm:text-base/normal">
                Browse Cake Bakers
              </ButtonPrimary>
            </>
          }
        />

        <section>
          <Heading subheading="Hand-picked cake vendors selected for you.">
            Featured Cake Bakers
          </Heading>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3 xl:grid-cols-3">
            {DEMO_CAKES_DATA.map((cake) => (
              <CakeCard key={cake.id} data={cake} />
            ))}
          </div>
          <div className="mt-16 flex items-center justify-center">
            <ButtonPrimary href={'/cakes'}>
              View all bakers
            </ButtonPrimary>
          </div>
        </section>

        <SectionOurFeatures
          subHeading="Benefits"
          heading="Why order with us?"
          listItems={[
            {
              badge: 'Fresh',
              title: 'Baked fresh to order',
              description: 'Every cake is baked fresh upon your order, never from frozen stock',
            },
            {
              badge: 'Local',
              badgeColor: 'green',
              title: 'Support local bakers',
              description: 'Connect with talented home-based and professional bakers in your city',
            },
            {
              badge: 'Delivery',
              badgeColor: 'red',
              title: 'Fast & safe delivery',
              description: 'Carefully packed and delivered to your doorstep with real-time tracking',
            },
          ]}
        />

        <Divider />

        <SectionHowItWork />

        <SectionSubscribe2 />

        <Divider />

        <section className="relative py-16">
          <BackgroundSection />
          <SectionBecomeAnAuthor />
        </section>

        <section className="relative py-16">
          <SectionClientSay />
        </section>
      </div>
    </main>
  )
}

export default Page
