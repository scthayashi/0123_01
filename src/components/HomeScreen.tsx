import { motion } from 'framer-motion'
import { categories } from '../data/questions'
import { getTodayCount } from '../lib/storage'
import type { Category } from '../types'

interface Props {
  onSelect: (category: Category) => void
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function HomeScreen({ onSelect }: Props) {
  const todayCount = getTodayCount()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-dvh px-6 pt-16 pb-12"
    >
      <header className="mb-14 max-w-sm mx-auto">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xs tracking-widest text-zinc-400 uppercase mb-4"
        >
          Learning Log
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-semibold text-zinc-800 leading-relaxed"
        >
          今日の学びは
          <br />
          何ですか？
        </motion.h1>
        {todayCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-sm text-zinc-400"
          >
            今日は {todayCount} 件の学びを記録しました
          </motion.p>
        )}
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-sm mx-auto grid grid-cols-2 gap-3"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            variants={itemVariants}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(cat)}
            className="group relative flex flex-col items-start gap-4 rounded-2xl bg-white/70 p-5 text-left transition-colors hover:bg-white cursor-pointer"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: cat.color + '12' }}
            >
              <cat.icon
                size={19}
                strokeWidth={1.8}
                style={{ color: cat.color }}
              />
            </span>
            <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
              {cat.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}
