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
    color: '#8b7355',
  },
  {
    id: 'relationships',
    label: '人間関係',
    icon: Heart,
    color: '#c2856e',
  },
  {
    id: 'finance',
    label: 'ファイナンス',
    icon: Wallet,
    color: '#7d8a6e',
  },
  {
    id: 'hobbies',
    label: '趣味',
    icon: Palette,
    color: '#9b8ab8',
  },
  {
    id: 'social',
    label: '社会貢献',
    icon: Globe,
    color: '#6e8fa0',
  },
  {
    id: 'intellect',
    label: '知性',
    icon: BookOpen,
    color: '#a08b6e',
  },
  {
    id: 'health',
    label: '健康',
    icon: Activity,
    color: '#7daa8e',
  },
]

export const questions: Question[] = [
  {
    id: 'insight',
    type: 'text',
    title: '具体的な気づきは？',
    subtitle: '今日の学びを、あなたの言葉で自由に書いてください。',
    placeholder:
      '例: ミーティングで相手の話を最後まで聞くことで、より深い議論ができた。',
  },
  {
    id: 'next-action',
    type: 'text',
    title: 'ネクストアクションは？',
    subtitle: 'この気づきを活かして、明日から何をしますか？',
    placeholder: '例: 相手が話し終えるまで3秒待つルールを作る。',
  },
]
