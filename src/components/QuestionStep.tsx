import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import type { Question } from '../types'

interface Props {
  question: Question
  value: string
  isLast: boolean
  accentColor: string
  onSubmit: (value: string) => void
}

export default function QuestionStep({
  question,
  value: initialValue,
  isLast,
  accentColor,
  onSubmit,
}: Props) {
  const [value, setValue] = useState(initialValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus()
    }, 400)
    return () => clearTimeout(timer)
  }, [question.id])

  const canSubmit = value.trim().length > 0

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(value.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-800 leading-relaxed mb-2">
          {question.title}
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {question.subtitle}
        </p>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={question.placeholder}
        rows={5}
        className="w-full resize-none rounded-xl bg-white/80 px-5 py-4 text-[15px] text-zinc-700 leading-relaxed placeholder:text-zinc-300 transition-shadow focus:shadow-sm"
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      />

      <p className="mt-3 text-xs text-zinc-300 text-right">
        Ctrl + Enter で送信
      </p>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mt-6 self-end flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        style={{ backgroundColor: accentColor }}
      >
        {isLast ? (
          <>
            保存する
            <Check size={15} strokeWidth={2.2} />
          </>
        ) : (
          <>
            次へ
            <ArrowRight size={15} strokeWidth={2.2} />
          </>
        )}
      </motion.button>
    </div>
  )
}
