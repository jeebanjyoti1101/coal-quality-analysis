import { motion } from 'framer-motion'
import heroCoal from '../assets/hero_coal.png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' },
})

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated blobs */}
      <div className="hero-blob w-96 h-96 bg-fire/20 top-20 -left-20" style={{ position: 'absolute' }} />
      <div className="hero-blob w-72 h-72 bg-amber-500/15 bottom-20 right-10" style={{ position: 'absolute', animationDelay: '3s' }} />
      <div className="hero-blob w-56 h-56 bg-red-500/10 top-1/2 left-1/2" style={{ position: 'absolute', animationDelay: '5s' }} />

      <div className="section-container relative z-10 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div {...fadeUp(0)}>
              <span className="section-tag">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                AI-Powered Analysis Engine
              </span>
            </motion.div>

            <motion.h1
              className="section-title mt-4 mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            >
              Coal Quality<br />
              <span className="gradient-text">Prediction System</span>
            </motion.h1>

            <motion.p
              className="section-desc mb-10"
              {...fadeUp(0.3)}
            >
              Leverage advanced Machine Learning to instantly classify coal samples, optimize combustion efficiency, and reduce environmental impact across India's mining sector.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-6 mb-10 justify-center lg:justify-start"
              {...fadeUp(0.45)}
            >
              {[
                { val: '95%+', label: 'Accuracy' },
                { val: '6',    label: 'Features Analyzed' },
                { val: '<1s',  label: 'Prediction Time' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-fire">{s.val}</div>
                  <div className="text-xs text-coal-500 font-semibold uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              {...fadeUp(0.6)}
            >
              <a href="#predict" className="btn-fire text-base px-8 py-3.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                Test Your Coal
              </a>
              <a href="#types" className="btn-ghost text-base px-8 py-3.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.85, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-fire/20 to-amber-400/10 rounded-3xl blur-3xl" />
              <img
                src={heroCoal}
                alt="Premium Coal Sample"
                className="w-full max-w-lg mx-auto rounded-3xl border border-coal-700/50 shadow-[0_25px_70px_rgba(249,115,22,0.2)] relative z-10 animate-float"
              />
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-6 -left-6 glass-card px-5 py-3 rounded-2xl z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">XGBoost Model Active</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <div className="flex flex-col items-center gap-2 text-coal-600">
          <span className="text-xs tracking-widest uppercase font-bold">Scroll</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
