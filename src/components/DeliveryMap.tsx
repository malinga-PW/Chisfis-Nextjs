'use client'

import { Map, MapMarker, MarkerContent, MapControls, useMap, type MapViewport } from '@/components/ui/map'
import { Location01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type MapLibreGL from 'maplibre-gl'
import { useEffect, useId, useMemo, useState } from 'react'

interface Props {
  onLocationChange?: (lat: number, lng: number) => void
  height?: string
  initialLat?: number
  initialLng?: number
  draggable?: boolean
  showLocateButton?: boolean
  selectionMode?: 'marker' | 'center'
  radiusKm?: number
  highlightRadius?: boolean
  radiusCenterLat?: number
  radiusCenterLng?: number
}

const DEFAULT_CENTER: [number, number] = [79.8612, 6.9271]
const EARTH_RADIUS_KM = 6371
const CIRCLE_STEPS = 72
const EMPTY_RADIUS_FEATURE = createRadiusCircleFeature(DEFAULT_CENTER[1], DEFAULT_CENTER[0], 0.1)

function createRadiusCircleFeature(lat: number, lng: number, radiusKm: number): GeoJSON.Feature<GeoJSON.Polygon> {
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180
  const angularDistance = radiusKm / EARTH_RADIUS_KM
  const coordinates: [number, number][] = []

  for (let i = 0; i <= CIRCLE_STEPS; i += 1) {
    const bearing = (2 * Math.PI * i) / CIRCLE_STEPS
    const sinLat = Math.sin(latRad)
    const cosLat = Math.cos(latRad)
    const sinAd = Math.sin(angularDistance)
    const cosAd = Math.cos(angularDistance)

    const pointLat = Math.asin(sinLat * cosAd + cosLat * sinAd * Math.cos(bearing))
    const pointLng = lngRad + Math.atan2(Math.sin(bearing) * sinAd * cosLat, cosAd - sinLat * Math.sin(pointLat))

    coordinates.push([(pointLng * 180) / Math.PI, (pointLat * 180) / Math.PI])
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  }
}

function RadiusOverlay({ lat, lng, radiusKm, visible }: { lat: number; lng: number; radiusKm: number; visible: boolean }) {
  const { map, isLoaded } = useMap()
  const id = useId()
  const sourceId = `delivery-radius-source-${id}`
  const fillLayerId = `delivery-radius-fill-${id}`
  const strokeLayerId = `delivery-radius-stroke-${id}`

  const feature = useMemo(() => createRadiusCircleFeature(lat, lng, Math.max(radiusKm, 0.1)), [lat, lng, radiusKm])

  useEffect(() => {
    if (!isLoaded || !map) return

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: EMPTY_RADIUS_FEATURE,
      })
    }

    if (!map.getLayer(fillLayerId)) {
      map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.16,
        },
      })
    }

    if (!map.getLayer(strokeLayerId)) {
      map.addLayer({
        id: strokeLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 2,
          'line-opacity': 0.85,
        },
      })
    }

    return () => {
      try {
        if (map.getLayer(strokeLayerId)) map.removeLayer(strokeLayerId)
        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch {
        // ignore cleanup errors
      }
    }
  }, [fillLayerId, isLoaded, map, sourceId, strokeLayerId])

  useEffect(() => {
    if (!isLoaded || !map) return

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined
    source?.setData(feature)
  }, [feature, isLoaded, map, sourceId])

  useEffect(() => {
    if (!isLoaded || !map) return

    const nextVisibility = visible ? 'visible' : 'none'
    if (map.getLayer(fillLayerId)) map.setLayoutProperty(fillLayerId, 'visibility', nextVisibility)
    if (map.getLayer(strokeLayerId)) map.setLayoutProperty(strokeLayerId, 'visibility', nextVisibility)
  }, [fillLayerId, isLoaded, map, strokeLayerId, visible])

  return null
}

export const DeliveryMap = ({
  onLocationChange,
  height = 'h-72',
  initialLat = DEFAULT_CENTER[1],
  initialLng = DEFAULT_CENTER[0],
  draggable = true,
  showLocateButton = true,
  selectionMode = 'marker',
  radiusKm,
  highlightRadius = false,
  radiusCenterLat,
  radiusCenterLng,
}: Props) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({ lat: initialLat, lng: initialLng })
  const [isLocating, setIsLocating] = useState(false)
  const [viewport, setViewport] = useState<Partial<MapViewport>>({
    center: [initialLng, initialLat],
    zoom: 14,
  })

  const isCenterSelection = selectionMode === 'center'
  const shouldShowRadius = highlightRadius && typeof radiusKm === 'number' && radiusKm > 0

  useEffect(() => {
    onLocationChange?.(position.lat, position.lng)
  }, [onLocationChange, position.lat, position.lng])

  const updatePositionAndCenter = (lat: number, lng: number) => {
    setPosition({ lat, lng })
    setViewport((prev) => ({ ...prev, center: [lng, lat] }))
  }

  const handleLocateMe = () => {
    if (!('geolocation' in navigator)) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        updatePositionAndCenter(newPos.lat, newPos.lng)
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
          viewport={viewport}
          onViewportChange={(nextViewport) => {
            setViewport(nextViewport)
            if (isCenterSelection) {
              const [centerLng, centerLat] = nextViewport.center
              setPosition((prev) => (prev.lat === centerLat && prev.lng === centerLng ? prev : { lat: centerLat, lng: centerLng }))
            }
          }}
        >
          {!isCenterSelection && (
            <MapMarker
              longitude={position.lng}
              latitude={position.lat}
              draggable={draggable}
              onDragEnd={(lngLat) => {
                if (!draggable) return
                updatePositionAndCenter(lngLat.lat, lngLat.lng)
              }}
            >
              <MarkerContent>
                <div className="flex size-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900">
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
              </MarkerContent>
            </MapMarker>
          )}
          {shouldShowRadius && <RadiusOverlay lat={radiusCenterLat ?? position.lat} lng={radiusCenterLng ?? position.lng} radiusKm={radiusKm as number} visible={shouldShowRadius} />}
          <MapControls showZoom showLocate={false} />
        </Map>
      </div>
      {isCenterSelection && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="-translate-y-4">
            <div className="relative">
              <div className="absolute left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-blue-500/20 blur-sm" />
              <svg className="relative h-8 w-8 text-blue-700 drop-shadow-md dark:text-blue-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {showLocateButton && (
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium shadow-md transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          <HugeiconsIcon icon={Location01Icon} size={16} className={isLocating ? 'animate-spin' : ''} />
          {isLocating ? 'Locating...' : 'Use My Current Location'}
        </button>
      )}
    </div>
  )
}
