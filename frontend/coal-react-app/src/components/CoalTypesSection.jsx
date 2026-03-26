import { useState } from 'react'
import { motion } from 'framer-motion'

import peatImg from '../assets/Peat.png'
import ligniteImg from '../assets/lignite.png'
import bituminousImg from '../assets/Bituminous.png'
import anthraciteImg from '../assets/Anthracite.png'

// Using local images now
// These are reliable external URLs for coal type imagery
const coalTypes = [
  {
    id: 'peat',
    name: 'Peat',
    badge: 'Lowest Grade',
    badgeColor: 'bg-stone-600 text-stone-200',
    image: peatImg,
    imageFallback: peatImg,
    description: 'Youngest stage of coal formation. Partially decomposed plant matter with very low carbon content and high moisture.',
    carbon: '45–60%',
    calorific: '2,000–3,000 kcal/kg',
    uses: 'Peat bogs fuel, compost, early-stage energy',
    wikiLink: 'https://en.wikipedia.org/wiki/Peat',
    color: 'from-stone-600/20 to-stone-800/10',
    glow: 'rgba(120,113,108,0.3)',
  },
  {
    id: 'lignite',
    name: 'Lignite',
    badge: 'Low Grade',
    badgeColor: 'bg-cyan-800 text-cyan-200',
    image: ligniteImg,
    imageFallback: ligniteImg,
    description: 'Brown coal with intermediate properties between peat and bituminous. High moisture, low heating value.',
    carbon: '60–75%',
    calorific: '3,000–5,000 kcal/kg',
    uses: 'Thermal power stations, local heating',
    wikiLink: 'https://en.wikipedia.org/wiki/Lignite',
    color: 'from-cyan-800/20 to-cyan-950/10',
    glow: 'rgba(8,145,178,0.3)',
  },
  {
    id: 'bituminous',
    name: 'Bituminous',
    badge: 'High Grade',
    badgeColor: 'bg-sky-600 text-sky-100',
    image: bituminousImg,
    imageFallback: bituminousImg,
    description: 'The most abundant coal type worldwide. High energy content and excellent combustion properties for industrial use.',
    carbon: '75–90%',
    calorific: '5,500–7,500 kcal/kg',
    uses: 'Steel production, electricity generation, coke making',
    wikiLink: 'https://en.wikipedia.org/wiki/Bituminous_coal',
    color: 'from-sky-600/20 to-sky-900/10',
    glow: 'rgba(2,132,199,0.4)',
  },
  {
    id: 'anthracite',
    name: 'Anthracite',
    badge: 'Premium Grade',
    badgeColor: 'bg-fire text-white',
    image: anthraciteImg,
    imageFallback: anthraciteImg,
    description: 'Highest rank of coal with brilliant lustre. Cleanest burning with maximum carbon concentration.',
    carbon: '90–98%',
    calorific: '7,000–8,500 kcal/kg',
    uses: 'Residential heating, metallurgy, water filtration',
    wikiLink: 'https://en.wikipedia.org/wiki/Anthracite',
    color: 'from-blue-600/20 to-blue-900/10',
    glow: 'rgba(37,99,235,0.5)',
  },
]

function CoalCard({ coal, index }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      className="flip-card h-[420px] cursor-pointer"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      onClick={() => window.open(coal.wikiLink, '_blank')}
      whileHover={{ scale: 1.03 }}
    >
      <div className={`flip-inner ${flipped ? 'flipped' : ''}`} style={{ height: '100%' }}>
        {/* Front */}
        <div
          className={`flip-front glass-card bg-gradient-to-b ${coal.color} border border-coal-700/50`}
          style={{ boxShadow: flipped ? 'none' : `0 0 30px ${coal.glow}` }}
        >
          {/* Image */}
          <div className="h-48 overflow-hidden rounded-t-2xl relative">
            <img
              src={coal.image}
              alt={coal.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              onError={e => { e.target.src = coal.imageFallback }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coal-900/80 to-transparent" />
            <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${coal.badgeColor}`}>
              {coal.badge}
            </span>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-2xl font-black text-white mb-2">{coal.name}</h3>
            <p className="text-coal-400 text-sm leading-relaxed mb-4">{coal.description}</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs text-coal-400">
                <span className="text-fire font-bold">C:</span> {coal.carbon}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-coal-400">
                <span className="text-amber-400 font-bold">GCV:</span> {coal.calorific}
              </div>
            </div>
            <p className="text-xs text-coal-600 mt-4 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Click to view on Wikipedia
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className={`flip-back glass-card bg-gradient-to-b ${coal.color} border border-fire/30`}
          style={{ boxShadow: `0 0 40px ${coal.glow}` }}
        >
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-fire/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-fire" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white">{coal.name}</h3>
              </div>

              <div className="space-y-4">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-xs text-coal-500 uppercase tracking-widest font-bold mb-1">Carbon Content</p>
                  <p className="text-lg font-black text-fire">{coal.carbon}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-xs text-coal-500 uppercase tracking-widest font-bold mb-1">Calorific Value</p>
                  <p className="text-lg font-black text-amber-400">{coal.calorific}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-xs text-coal-500 uppercase tracking-widest font-bold mb-1">Common Uses</p>
                  <p className="text-sm text-coal-300 leading-relaxed">{coal.uses}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-coal-600 text-center flex items-center justify-center gap-1 mt-4">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Click to flip back
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CoalTypesSection() {
  return (
    <section id="types" className="py-28 relative" style={{ background: 'linear-gradient(180deg, #0c0a09 0%, #111110 50%, #0c0a09 100%)' }}>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Coal Classification
          </span>
          <h2 className="section-title mt-2 mb-4">Types of Coal</h2>
          <p className="section-desc mx-auto">
            From ancient peat bogs to gleaming anthracite — understand the four key coal ranks and what makes each unique.
          </p>
          <p className="text-xs text-coal-600 mt-3">
            <span className="text-fire">✦</span> Click any card to read more on Wikipedia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coalTypes.map((coal, i) => (
            <CoalCard key={coal.id} coal={coal} index={i} />
          ))}
        </div>

        {/* Quality rank bar */}
        <motion.div
          className="mt-16 glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <p className="text-sm text-coal-500 font-bold uppercase tracking-widest text-center mb-4">
            Quality Rank Progression
          </p>
          <div className="flex items-center gap-2">
            {coalTypes.map((coal, i) => (
              <div key={coal.id} className="flex-1 text-center">
                <div
                  className="h-3 rounded-full mb-2 transition-all duration-300 hover:scale-y-150"
                  style={{
                    background: `linear-gradient(90deg, hsl(200, 80%, ${35 + i * 10}%), hsl(200, 80%, ${45 + i * 10}%))`,
                  }}
                />
                <span className="text-xs font-bold text-coal-400">{coal.name}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-coal-600">
            <span>← Lower Rank</span>
            <span>Higher Rank →</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
