import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'

const importanceData = [
  { feature: 'Calorific Value', importance: 0.38, color: '#f97316' },
  { feature: 'Ash Content',     importance: 0.24, color: '#ef4444' },
  { feature: 'Fixed Carbon',    importance: 0.15, color: '#22c55e' },
  { feature: 'Volatile Matter', importance: 0.11, color: '#f59e0b' },
  { feature: 'Moisture',        importance: 0.08, color: '#3b82f6' },
  { feature: 'Sulfur',          importance: 0.04, color: '#a855f7' },
]

const distributionData = [
  { name: 'Good Quality',  value: 62, color: '#22c55e' },
  { name: 'Poor Quality',  value: 38, color: '#ef4444' },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-3 text-sm border border-coal-700">
        <p className="text-white font-bold">{payload[0].payload.feature ?? payload[0].name}</p>
        <p className="text-fire font-semibold">
          {payload[0].value < 1
            ? `${(payload[0].value * 100).toFixed(0)}%`
            : `${payload[0].value}%`}
        </p>
      </div>
    )
  }
  return null
}

export default function InsightsSection() {
  return (
    <section id="insights" className="py-28 relative" style={{ background: 'linear-gradient(180deg, #0c0a09 0%, #111110 100%)' }}>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            AI Insights
          </span>
          <h2 className="section-title mt-2 mb-4">Model Analytics</h2>
          <p className="section-desc mx-auto">
            How our XGBoost model weighs each coal property — and the quality distribution in our training dataset.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Importance Bar Chart */}
          <motion.div
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-fire/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-fire" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Feature Importance</h3>
                <p className="text-xs text-coal-500">XGBoost model weights</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={importanceData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 0.45]}
                  tickFormatter={v => `${(v * 100).toFixed(0)}%`}
                  tick={{ fill: '#78716c', fontSize: 11 }}
                  axisLine={{ stroke: '#44403c' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  width={110}
                  tick={{ fill: '#a8a29e', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.05)' }} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {importanceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <p className="text-xs text-coal-600 text-center mt-4 bg-coal-900 rounded-lg p-3 border border-coal-800">
              Calorific value and ash content are the strongest predictors of coal grade.
            </p>
          </motion.div>

          {/* Distribution Pie Chart */}
          <motion.div
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Quality Distribution</h3>
                <p className="text-xs text-coal-500">Training dataset composition</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {distributionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={value => <span style={{ color: '#a8a29e', fontSize: 13 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>

            <p className="text-xs text-coal-600 text-center mt-4 bg-coal-900 rounded-lg p-3 border border-coal-800">
              62% of samples in training data classified as good quality coal.
            </p>
          </motion.div>
        </div>

        {/* Methodology note */}
        <motion.div
          className="glass-card rounded-2xl p-6 mt-8 flex flex-col sm:flex-row items-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">About the Model</h4>
            <p className="text-coal-400 text-sm">
              The prediction engine uses an <span className="text-fire font-semibold">XGBoost Classifier</span> trained on proximate analysis data with StandardScaler normalization. 
              Coal is classified Good if calorific value &gt; 5500 kcal/kg AND ash &lt; 30%. The model achieves &gt;95% accuracy on holdout test sets.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
