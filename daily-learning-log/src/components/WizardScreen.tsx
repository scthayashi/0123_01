import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { questions } from '../data/questions'
import { saveEntry, rgba } from '../lib/storage'
import type { Category, LogEntry } from '../types'
import QuestionStep from './QuestionStep'

interface Props {
  category: Category
  onComplete: () => void
  onBack: () => void
}

const ease = [0.22, 1, 0.36, 1]

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
    filter: 'blur(4px)',
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
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35 }}
      className="min-h-dvh flex flex-col px-6 pt-[env(safe-area-inset-top,0px)]"
    >
      <div className="max-w-[380px] mx-auto w-full flex flex-col flex-1 pt-12 pb-10">
        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleBack}
            className="flex items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer -ml-0.5"
          >
            <ArrowLeft size={17} strokeWidth={1.7} />
            <span className="text-[13px]">
              {step === 0 ? '戻る' : '前へ'}
            </span>
          </motion.button>

          <div className="flex items-center gap-2">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-md"
              style={{ backgroundColor: rgba(category.rgb, 0.1) }}
            >
              <category.icon
                size={11}
                strokeWidth={2}
                style={{ color: rgba(category.rgb, 0.7) }}
              />
            </span>
            <span className="text-[11px] text-stone-400 tracking-wide">
              {category.label}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <motion.div
                key={i}
                className="h-[2px] flex-1 rounded-full overflow-hidden"
                style={{ backgroundColor: rgba(category.rgb, 0.08) }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: rgba(category.rgb, 0.5) }}
                  initial={{ width: '0%' }}
                  animate={{ width: i < step ? '100%' : i === step ? `${progress / questions.length * 100 * questions.length}%` : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease }}
            >
              <QuestionStep
                question={currentQuestion}
                value={answers[currentQuestion.id] || ''}
                isLast={isLast}
                categoryRgb={category.rgb}
                onSubmit={handleNext}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
