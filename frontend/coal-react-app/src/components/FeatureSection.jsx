import { useState } from 'react'
import { motion } from 'framer-motion'

const features = [
  {
    id: 'moisture',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
      </svg>
    ),
    name: 'Moisture',
    unit: '% (0–30)',
    color: 'blue',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    desc: 'Water content in the coal sample. High moisture wastes energy evaporating water before combustion even begins — directly reducing heating value.',
    impact: 'Inverse',
    tip: 'Lower is better for energy output',
  },
  {
    id: 'ash',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
      </svg>
    ),
    name: 'Ash Content',
    unit: '% (5–60)',
    color: 'stone',
    bg: 'bg-stone-500/10',
    text: 'text-stone-400',
    border: 'border-stone-500/30',
    desc: 'Incombustible mineral residue left after burning. High ash = lower energy yield + increased waste disposal costs for industrial users.',
    impact: 'Inverse',
    tip: 'Lower ash → cleaner combustion',
  },
  {
    id: 'volatile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
    name: 'Volatile Matter',
    unit: '% (10–50)',
    color: 'sky',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    desc: 'Gases released when coal is heated. Affects ignition ease, flame characteristics, and combustion behavior — important for furnace design.',
    impact: 'Variable',
    tip: 'Affects ignition & flame quality',
  },
  {
    id: 'fixed_carbon',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    ),
    name: 'Fixed Carbon',
    unit: '% (20–80)',
    color: 'emerald',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    desc: 'The solid carbon remaining after volatile gases escape. Primary energy source in coal — more fixed carbon means more heat energy per kilogram.',
    impact: 'Direct',
    tip: 'Higher = more energy stored',
  },
  {
    id: 'sulfur',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    ),
    name: 'Sulfur',
    unit: '% (0–5)',
    color: 'yellow',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    desc: 'Burns to form SO₂ — a harmful pollutant causing acid rain. Low sulfur coal is environmentally superior and preferred by modern power plants.',
    impact: 'Inverse',
    tip: 'Lower sulfur → eco-friendly',
  },
  {
    id: 'calorific',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
      </svg>
    ),
    name: 'Calorific Value',
    unit: 'kcal/kg (3000–8000)',
    color: 'red',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    desc: 'Total heat energy released per kg of coal burned. The single most critical quality metric. Premium coal ≥ 5500 kcal/kg; industrial standard > 4500.',
    impact: 'Direct',
    tip: 'The single most critical metric',
  },
]

function FeatureCard({ f, index }) {
  const [tooltip, setTooltip] = useState(false)

  return (
    <motion.div
      className={`feature-card relative border ${f.border} group`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
    >
      {/* Impact badge */}
      <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full ${
        f.impact === 'Direct' ? 'bg-green-500/20 text-green-400' :
        f.impact === 'Inverse' ? 'bg-red-500/20 text-red-400' :
        'bg-amber-500/20 text-amber-400'
      }`}>
        {f.impact}
      </div>

      <div className={`feature-icon ${f.bg} ${f.text}`}>{f.icon}</div>

      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-lg font-bold text-white">{f.name}</h3>
        </div>
        <p className="text-xs text-coal-600 font-semibold mb-3">{f.unit}</p>
        <p className="text-coal-400 text-sm leading-relaxed">{f.desc}</p>
      </div>

      {/* Hover tooltip bar */}
      <div
        className="mt-4 pt-4 border-t border-coal-800 flex items-center justify-between cursor-help"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        <span className={`text-xs font-bold ${f.text} flex items-center gap-1`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Quick Tip
        </span>
        {tooltip && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-white bg-coal-700 rounded-lg px-2 py-1"
          >
            {f.tip}
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

export default function FeatureSection() {
  return (
    <section id="features" className="py-28 bg-coal-950">
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Proximate Analysis
          </span>
          <h2 className="section-title mt-2 mb-4">Coal Quality Parameters</h2>
          <p className="section-desc mx-auto">
            Six critical chemical properties that our AI model analyzes to determine coal grade and combustion quality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.id} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
