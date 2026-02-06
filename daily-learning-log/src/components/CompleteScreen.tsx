import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

interface Props {
  onHome: () => void
}

const ease = [0.22, 1, 0.36, 1]

export default function CompleteScreen({ onHome }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className="min-h-dvh flex flex-col items-center justify-center px-6"
    >
      {/* Decorative sparkle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease }}
        className="absolute"
        style={{ marginTop: -100, marginLeft: 60 }}
      >
        <Sparkles size={14} strokeWidth={1.5} className="text-amber-300/60" />
      </motion.div>

      {/* Check circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 18,
          delay: 0.1,
        }}
        className="mb-10 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgba(184, 128, 106, 0.08)' }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 14,
            delay: 0.35,
          }}
        >
          <Check
            size={26}
            strokeWidth={2}
            style={{ color: 'rgba(184, 128, 106, 0.7)' }}
          />
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55, ease }}
        className="text-[20px] font-semibold text-stone-800 mb-2.5"
      >
        記録しました
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5, ease }}
        className="text-[13px] text-stone-400 mb-14"
      >
        今日の学びが、明日の力になります。
      </motion.p>

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.45, ease }}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        onClick={onHome}
        className="rounded-full bg-stone-800 px-8 py-3 text-[13px] font-medium text-white cursor-pointer hover:bg-stone-700 transition-colors duration-200"
      >
        ホームに戻る
      </motion.button>
    </motion.div>
  )
}
