'use client'

import { Map, MapMarker, MarkerContent, MapControls } from '@/components/ui/map'
import { LocateFixedIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useState } from 'react'

interface Props {
  onLocationChange?: (lat: number, lng: number) => void
  height?: string
}

const DEFAULT_CENTER: [number, number] = [79.8612, 6.9271]

export const DeliveryMap = ({ onLocationChange, height = 'h-72' }: Props) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({ lat: DEFAULT_CENTER[1], lng: DEFAULT_CENTER[0] })
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    onLocationChange?.(position.lat, position.lng)
  }, [position])

  const handleLocateMe = () => {
    if (!('geolocation' in navigator)) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosition(newPos)
        setIsLocating(false)
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className="relative">
      <div className={`w-full overflow-hidden rounded-xl ${height}`}>
        <Map
          className="h-full w-full"
          viewport={{ center: [position.lng, position.lat], zoom: 14 }}
        >
          <MapMarker
            longitude={position.lng}
            latitude={position.lat}
            draggable
            onDragEnd={(lngLat) => setPosition({ lat: lngLat.lat, lng: lngLat.lng })}
          >
            <MarkerContent>
              <div className="flex size-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
            </MarkerContent>
          </MapMarker>
          <MapControls showZoom showLocate={false} />
        </Map>
      </div>
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium shadow-md transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
      >
        <HugeiconsIcon icon={LocateFixedIcon} size={16} className={isLocating ? 'animate-spin' : ''} />
        {isLocating ? 'Locating...' : 'Use My Current Location'}
      </button>
    </div>
  )
}
