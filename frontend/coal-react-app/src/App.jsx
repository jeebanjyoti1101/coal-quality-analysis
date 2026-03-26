import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import CoalTypesSection from './components/CoalTypesSection'
import FeatureSection from './components/FeatureSection'
import PredictionSection from './components/PredictionSection'
import MapSection from './components/MapSection'
import InsightsSection from './components/InsightsSection'
import Footer from './components/Footer'
import ParticleCanvas from './components/ParticleCanvas'

function App() {
  return (
    <div className="min-h-screen bg-coal-950 text-coal-300 relative">
      <ParticleCanvas />
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <CoalTypesSection />
          <FeatureSection />
          <PredictionSection />
          <MapSection />
          <InsightsSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
