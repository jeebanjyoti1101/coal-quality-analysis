import { useEffect } from 'react'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'

// We use a dynamic import to avoid SSR issues
// For Vite + React, we import Leaflet normally
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon   from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix default icon paths for Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow })

const regions = [
  {
    name: 'Jharkhand',
    lat: 23.6102, lng: 85.2799,
    color: '#22c55e',
    grade: 'Premium Grade',
    production: '~110 MT/year',
    type: 'Bituminous / Coking',
    quality: 'High',
  },
  {
    name: 'Odisha',
    lat: 20.9517, lng: 85.0985,
    color: '#22c55e',
    grade: 'High Grade',
    production: '~95 MT/year',
    type: 'Bituminous',
    quality: 'High',
  },
  {
    name: 'Chhattisgarh',
    lat: 21.2787, lng: 81.8661,
    color: '#3b82f6',
    grade: 'Average Grade',
    production: '~75 MT/year',
    type: 'Sub-bituminous',
    quality: 'Moderate',
  },
  {
    name: 'West Bengal',
    lat: 23.5204, lng: 87.3119,
    color: '#3b82f6',
    grade: 'Average Grade',
    production: '~35 MT/year',
    type: 'Bituminous',
    quality: 'Moderate',
  },
  {
    name: 'Madhya Pradesh',
    lat: 23.4733, lng: 80.3288,
    color: '#f97316',
    grade: 'Standard Grade',
    production: '~50 MT/year',
    type: 'Bituminous',
    quality: 'Moderate-Low',
  },
]

const legend = [
  { color: '#22c55e', label: 'High Quality' },
  { color: '#3b82f6', label: 'Moderate Quality' },
  { color: '#f97316', label: 'Standard Grade' },
]

export default function MapSection() {
  useEffect(() => {
    // Prevent double initialization
    const container = document.getElementById('india-map')
    if (!container) return
    if (container._leaflet_id) return

    const map = L.map('india-map', {
      center:   [22.5, 82.5],
      zoom:     5,
      minZoom:   4,
      maxZoom:  10,
      zoomControl: true,
    })

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
    }).addTo(map)

    regions.forEach(r => {
      // Pulse circle
      const pulse = L.circleMarker([r.lat, r.lng], {
        radius: 24,
        color:       r.color,
        fillColor:   r.color,
        fillOpacity: 0.08,
        weight:      1,
      }).addTo(map)

      // Main marker
      const marker = L.circleMarker([r.lat, r.lng], {
        radius:      10,
        color:       '#fff',
        fillColor:   r.color,
        fillOpacity: 0.9,
        weight:      2,
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:180px">
          <div style="font-weight:800;font-size:15px;color:${r.color};margin-bottom:6px">${r.name}</div>
          <div style="font-size:11px;margin-bottom:4px"><span style="color:#78716c">Grade:</span> <strong style="color:#d6d3d1">${r.grade}</strong></div>
          <div style="font-size:11px;margin-bottom:4px"><span style="color:#78716c">Production:</span> <strong style="color:#d6d3d1">${r.production}</strong></div>
          <div style="font-size:11px;margin-bottom:4px"><span style="color:#78716c">Coal Type:</span> <strong style="color:#d6d3d1">${r.type}</strong></div>
          <div style="font-size:11px"><span style="color:#78716c">Quality:</span>
            <span style="background:${r.color}22;color:${r.color};padding:1px 6px;border-radius:999px;font-weight:700">${r.quality}</span>
          </div>
        </div>
      `, { maxWidth: 250 })

      marker.on('mouseover', function() { this.openPopup() })
    })

    return () => { map.remove() }
  }, [])

  return (
    <section id="map" className="py-28 bg-coal-950">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            Regional Data
          </span>
          <h2 className="section-title mt-2 mb-4">India Coal Production Map</h2>
          <p className="section-desc mx-auto">
            Explore India's key coal-producing states with quality-coded markers. Hover for production data.
          </p>
        </motion.div>

        <motion.div
          className="glass-card rounded-2xl overflow-hidden p-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-coal-700" style={{ height: 500 }}>
            <div id="india-map" style={{ height: '100%', width: '100%' }} />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 justify-center mt-5 pb-1">
            {legend.map(l => (
              <div key={l.label} className="flex items-center gap-2 text-sm font-semibold text-coal-400">
                <div className="w-3 h-3 rounded-full" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                {l.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Region stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {regions.map((r, i) => (
            <motion.div
              key={r.name}
              className="glass-card rounded-xl p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.04 }}
            >
              <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ background: r.color }} />
              <p className="text-sm font-bold text-white">{r.name}</p>
              <p className="text-xs text-coal-500">{r.production}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
