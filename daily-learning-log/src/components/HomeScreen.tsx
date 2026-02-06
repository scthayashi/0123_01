import { motion } from 'framer-motion'
import { categories } from '../data/questions'
import { getTodayCount, rgba } from '../lib/storage'
import type { Category } from '../types'

interface Props {
  onSelect: (category: Category) => void
}

const ease = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.25 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease },
  },
}

function formatDate(): string {
  const d = new Date()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return `${month}月${day}日（${weekdays[d.getDay()]}）`
}

export default function HomeScreen({ onSelect }: Props) {
  const todayCount = getTodayCount()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className="min-h-dvh px-6 pt-[env(safe-area-inset-top,0px)]"
    >
      <div className="max-w-[380px] mx-auto pt-14 pb-16">
        {/* Header */}
        <header className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="text-[11px] tracking-[0.15em] text-stone-400 mb-6"
          >
            {formatDate()}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="text-[22px] font-semibold text-stone-800 leading-[1.6]"
          >
            今日の学びは
            <br />
            何ですか？
          </motion.h1>

          {todayCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-4 text-[13px] text-stone-400"
            >
              今日 {todayCount} 件の学びを記録しました
            </motion.p>
          )}
        </header>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          {categories.map((cat, i) => {
            const isLast = i === categories.length - 1 && categories.length % 2 !== 0
            return (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97, y: 0 }}
                onClick={() => onSelect(cat)}
                className={`
                  group relative flex flex-col items-start gap-5
                  rounded-2xl bg-white/60 p-5 text-left
                  cursor-pointer transition-colors duration-200
                  hover:bg-white/90
                  ${isLast ? 'col-span-2 max-w-[calc(50%-6px)]' : ''}
                `}
                style={{
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.02)',
                }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: rgba(cat.rgb, 0.08) }}
                >
                  <cat.icon
                    size={18}
                    strokeWidth={1.7}
                    style={{ color: rgba(cat.rgb, 0.75) }}
                  />
                </span>
                <span className="text-[13px] font-medium text-stone-600 group-hover:text-stone-800 transition-colors duration-200">
                  {cat.label}
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
