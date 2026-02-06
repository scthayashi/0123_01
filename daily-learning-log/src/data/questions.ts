import type { Category, Question } from '../types'
import {
  Briefcase,
  Heart,
  Wallet,
  Palette,
  Globe,
  BookOpen,
  Activity,
} from 'lucide-react'

export const categories: Category[] = [
  {
    id: 'career',
    label: 'キャリア',
    icon: Briefcase,
    rgb: [139, 115, 85],
  },
  {
    id: 'relationships',
    label: '人間関係',
    icon: Heart,
    rgb: [184, 128, 106],
  },
  {
    id: 'finance',
    label: 'ファイナンス',
    icon: Wallet,
    rgb: [115, 138, 100],
  },
  {
    id: 'hobbies',
    label: '趣味',
    icon: Palette,
    rgb: [148, 130, 176],
  },
  {
    id: 'social',
    label: '社会貢献',
    icon: Globe,
    rgb: [104, 136, 152],
  },
  {
    id: 'intellect',
    label: '知性',
    icon: BookOpen,
    rgb: [152, 133, 100],
  },
  {
    id: 'health',
    label: '健康',
    icon: Activity,
    rgb: [110, 162, 130],
  },
]

export const questions: Question[] = [
  {
    id: 'insight',
    type: 'text',
    title: '具体的な気づきは？',
    subtitle: '今日の学びを、あなたの言葉で自由に書いてください。',
    placeholder:
      'ミーティングで相手の話を最後まで聞くことで、より深い議論ができた…',
  },
  {
    id: 'next-action',
    type: 'text',
    title: 'ネクストアクションは？',
    subtitle: 'この気づきを活かして、明日から何をしますか？',
    placeholder: '相手が話し終えるまで3秒待つルールを作る…',
  },
]
