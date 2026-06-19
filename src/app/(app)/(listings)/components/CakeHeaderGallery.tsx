'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const CAKE_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1600&q=80',
]

const CakeHeaderGallery = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAKE_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="relative w-full overflow-hidden rounded-3xl" style={{ height: '60vh', minHeight: '400px' }}>
      {CAKE_IMAGES.map((img, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === current ? 1 : 0 }}
        >
          <Image src={img} alt="Cake gallery" fill className="object-cover" priority={index === 0} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {CAKE_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </header>
  )
}

export default CakeHeaderGallery
