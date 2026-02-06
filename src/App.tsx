import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import HomeScreen from './components/HomeScreen'
import WizardScreen from './components/WizardScreen'
import CompleteScreen from './components/CompleteScreen'
import type { Category } from './types'

type Screen = 'home' | 'wizard' | 'complete'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  const handleSelectCategory = useCallback((category: Category) => {
    setSelectedCategory(category)
    setScreen('wizard')
  }, [])

  const handleComplete = useCallback(() => {
    setScreen('complete')
  }, [])

  const handleHome = useCallback(() => {
    setSelectedCategory(null)
    setScreen('home')
  }, [])

  return (
    <AnimatePresence mode="wait">
      {screen === 'home' && (
        <HomeScreen key="home" onSelect={handleSelectCategory} />
      )}
      {screen === 'wizard' && selectedCategory && (
        <WizardScreen
          key="wizard"
          category={selectedCategory}
          onComplete={handleComplete}
          onBack={handleHome}
        />
      )}
      {screen === 'complete' && (
        <CompleteScreen key="complete" onHome={handleHome} />
      )}
    </AnimatePresence>
  )
}
