import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { questions } from '../data/questions'
import { saveEntry } from '../lib/storage'
import type { Category, LogEntry } from '../types'
import QuestionStep from './QuestionStep'

interface Props {
  category: Category
  onComplete: () => void
  onBack: () => void
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 280 : -280,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -280 : 280,
    opacity: 0,
  }),
}

export default function WizardScreen({ category, onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const currentQuestion = questions[step]
  const isLast = step === questions.length - 1
  const progress = (step + 1) / questions.length

  const handleNext = useCallback(
    (value: string) => {
      const updated = { ...answers, [currentQuestion.id]: value }
      setAnswers(updated)

      if (isLast) {
        const entry: LogEntry = {
          id: crypto.randomUUID(),
          categoryId: category.id,
          answers: updated,
          createdAt: new Date().toISOString(),
        }
        saveEntry(entry)
        onComplete()
      } else {
        setDirection(1)
        setStep((s) => s + 1)
      }
    },
    [answers, currentQuestion, isLast, category.id, onComplete]
  )

  const handleBack = useCallback(() => {
    if (step === 0) {
      onBack()
    } else {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }, [step, onBack])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col px-6 pt-14 pb-8"
    >
      {/* Header */}
      <div className="max-w-sm mx-auto w-full mb-10">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer -ml-1"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
            <span className="text-sm">
              {step === 0 ? '戻る' : '前へ'}
            </span>
          </motion.button>
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg text-xs"
              style={{
                backgroundColor: category.color + '14',
                color: category.color,
              }}
            >
              <category.icon size={13} strokeWidth={2} />
            </span>
            <span className="text-xs text-zinc-400">{category.label}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: category.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 max-w-sm mx-auto w-full relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <QuestionStep
              question={currentQuestion}
              value={answers[currentQuestion.id] || ''}
              isLast={isLast}
              accentColor={category.color}
              onSubmit={handleNext}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
