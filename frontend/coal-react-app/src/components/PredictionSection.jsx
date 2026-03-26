import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FIELDS = [
  { id: 'moisture',        label: 'Moisture',       unit: '%',       range: '0 – 30',  icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', placeholder: '8.5' },
  { id: 'ash',             label: 'Ash Content',    unit: '%',       range: '5 – 60',  icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', placeholder: '18.0' },
  { id: 'volatile_matter', label: 'Volatile Matter',unit: '%',       range: '10 – 50', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', placeholder: '25.0' },
  { id: 'fixed_carbon',    label: 'Fixed Carbon',   unit: '%',       range: '20 – 80', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', placeholder: '45.0' },
  { id: 'sulfur',          label: 'Sulfur',         unit: '%',       range: '0 – 5',   icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', placeholder: '1.2' },
  { id: 'calorific_value', label: 'Calorific Value',unit: 'kcal/kg', range: '3000–8000',icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z', placeholder: '6200' },
]

export default function PredictionSection() {
  const [values, setValues]     = useState({})
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [apiError, setApiError] = useState(null)
  const confBarRef              = useRef(null)

  const handleChange = (id, val) => {
    setValues(v => ({ ...v, [id]: val }))
    if (errors[id]) setErrors(e => ({ ...e, [id]: '' }))
  }

  const validate = () => {
    const errs = {}
    FIELDS.forEach(f => {
      if (!values[f.id] && values[f.id] !== 0) errs[f.id] = 'Required'
      else if (isNaN(Number(values[f.id])))     errs[f.id] = 'Must be a number'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setResult(null)
    setApiError(null)
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moisture:        Number(values.moisture),
          ash:             Number(values.ash),
          volatile_matter: Number(values.volatile_matter),
          fixed_carbon:    Number(values.fixed_carbon),
          sulfur:          Number(values.sulfur),
          calorific_value: Number(values.calorific_value),
        }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || `API error ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setApiError(err.message || 'Could not reach API — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const isGood = result?.quality?.toLowerCase() === 'good'
  const confPct = result ? Math.round(result.confidence * 100) : 0

  return (
    <section id="predict" className="py-28 relative" style={{ background: 'linear-gradient(180deg, #0c0a09 0%, #111110 50%, #0c0a09 100%)' }}>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            AI Prediction
          </span>
          <h2 className="section-title mt-2 mb-4">Test Your Coal Sample</h2>
          <p className="section-desc mx-auto">
            Enter the proximate analysis values and let our XGBoost model assess coal quality in under a second.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <motion.div
            className="lg:w-7/12"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card p-7 rounded-2xl">
              <div className="flex items-center gap-3 mb-8 pb-5 border-b border-coal-700">
                <div className="w-9 h-9 rounded-lg bg-fire/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-fire" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Sample Laboratory Input</h3>
              </div>

              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {FIELDS.map(f => (
                    <div key={f.id}>
                      <label className="label-text">
                        {f.label}
                        <span className="text-coal-600 font-normal ml-1 text-xs">({f.range} {f.unit})</span>
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coal-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={f.icon}/>
                        </svg>
                        <input
                          type="number"
                          step="0.01"
                          placeholder={f.placeholder}
                          value={values[f.id] ?? ''}
                          onChange={e => handleChange(f.id, e.target.value)}
                          className={`input-field pl-9 pr-16 ${errors[f.id] ? 'border-red-500/60 ring-2 ring-red-500/20' : ''}`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-coal-500 font-semibold pointer-events-none">
                          {f.unit}
                        </span>
                      </div>
                      {errors[f.id] && (
                        <p className="text-red-400 text-xs mt-1">{errors[f.id]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-fire w-full mt-8 py-4 text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      Run Prediction Engine
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Result panel */}
          <motion.div
            className="lg:w-5/12"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AnimatePresence mode="wait">
              {/* Default state */}
              {!result && !apiError && (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]"
                >
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-full bg-coal-800 border-2 border-coal-700 flex items-center justify-center mb-6"
                  >
                    <svg className="w-12 h-12 text-coal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">Awaiting Input Data</h3>
                  <p className="text-coal-500 text-sm">Fill in the proximate analysis values and click Run Prediction Engine to see the AI assessment here.</p>
                </motion.div>
              )}

              {/* API Error */}
              {apiError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8 border border-red-500/30 bg-red-500/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-red-400 font-bold mb-1">API Error</h3>
                      <p className="text-coal-400 text-sm">{apiError}</p>
                      <p className="text-coal-600 text-xs mt-3">Make sure the FastAPI backend is running: <code className="text-amber-400">uvicorn app.main:app --reload</code></p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Result */}
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`glass-card rounded-2xl p-7 border ${
                    isGood
                      ? 'border-green-500/40 shadow-[0_0_50px_rgba(34,197,94,0.2)]'
                      : 'border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.2)]'
                  }`}
                  style={{ animation: isGood ? 'none' : 'shake 0.5s ease-in-out' }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-5 mb-6 pb-5 border-b border-white/10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        isGood ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      {isGood ? (
                        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                    </motion.div>
                    <div>
                      <p className="text-xs text-coal-500 uppercase tracking-widest font-bold mb-1">Quality Assessment</p>
                      <motion.h2
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className={`text-3xl font-black ${isGood ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {result.quality} Quality
                      </motion.h2>
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-coal-300 text-sm leading-relaxed mb-6">
                    {isGood
                      ? 'This coal sample meets premium quality standards. High calorific value and low impurities make it ideal for high-efficiency power generation and metallurgical processes.'
                      : 'This coal sample falls below acceptable quality thresholds. High moisture, ash or low calorific value reduces efficiency and increases operational costs.'}
                  </p>

                  {/* Confidence */}
                  <div className="bg-coal-900 rounded-xl p-5 border border-coal-700">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-coal-500">AI Confidence</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-black text-white"
                      >
                        {confPct}%
                      </motion.span>
                    </div>
                    <div className="conf-track">
                      <motion.div
                        className="conf-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${confPct}%` }}
                        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        style={{
                          background: isGood
                            ? 'linear-gradient(90deg, #22c55e, #86efac)'
                            : 'linear-gradient(90deg, #ef4444, #fca5a5)',
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-xs font-bold text-coal-600 bg-coal-800 p-3 rounded-lg">
                      <span>Model Engine:</span>
                      <span className="text-fire">{result.model_used}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
