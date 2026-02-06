import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Props {
  onHome: () => void
}

export default function CompleteScreen({ onHome }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: 0.35,
          }}
        >
          <Check size={28} strokeWidth={2} className="text-accent" />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl font-semibold text-zinc-800 mb-2"
      >
        記録しました
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-zinc-400 mb-12"
      >
        今日の学びが、明日の力になります。
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        whileTap={{ scale: 0.96 }}
        onClick={onHome}
        className="rounded-full bg-zinc-800 px-8 py-3 text-sm font-medium text-white cursor-pointer hover:bg-zinc-700 transition-colors"
      >
        ホームに戻る
      </motion.button>
    </motion.div>
  )
}
