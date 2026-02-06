import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { rgba } from '../lib/storage'
import type { Question } from '../types'

interface Props {
  question: Question
  value: string
  isLast: boolean
  categoryRgb: [number, number, number]
  onSubmit: (value: string) => void
}

export default function QuestionStep({
  question,
  value: initialValue,
  isLast,
  categoryRgb,
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
    }, 450)
    return () => clearTimeout(timer)
  }, [question.id])

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.max(el.scrollHeight, 140) + 'px'
  }, [])

  useEffect(() => {
    autoResize()
  }, [value, autoResize])

  const canSubmit = value.trim().length > 0

  const handleSubmit = () => {
    if (canSubmit) onSubmit(value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h2 className="text-[20px] font-semibold text-stone-800 leading-[1.5] mb-2">
          {question.title}
        </h2>
        <p className="text-[13px] text-stone-400 leading-relaxed">
          {question.subtitle}
        </p>
      </div>

      <div
        className="rounded-2xl bg-white/70 px-5 py-4 transition-shadow duration-300 focus-within:bg-white/95"
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={question.placeholder}
          rows={4}
          className="w-full resize-none bg-transparent text-[15px] text-stone-700 leading-[1.9] placeholder:text-stone-300"
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-[11px] text-stone-300 tracking-wide">
          {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-medium text-white transition-all duration-200 disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
          style={{ backgroundColor: rgba(categoryRgb, canSubmit ? 0.8 : 0.6) }}
        >
          {isLast ? (
            <>
              保存する
              <Check size={14} strokeWidth={2.2} />
            </>
          ) : (
            <>
              次へ
              <ArrowRight size={14} strokeWidth={2.2} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
