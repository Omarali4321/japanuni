'use client'

import { useTranslations } from 'next-intl'

const KEYS = [
  'Computer Science', 'Information Science', 'Engineering', 'Robotics', 'Materials Science', 'Architecture',
  'Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Biology', 'Chemistry', 'Physics', 'Mathematics',
  'Business', 'Economics', 'Management', 'Law', 'Political Science', 'International Relations',
  'Education', 'Psychology', 'Sociology', 'Linguistics', 'Literature', 'History', 'Arts',
  'Agriculture', 'Fisheries', 'Environmental Science', 'Energy',
] as const

// Values are English (the program data is English); labels are localized
export function SpecialtyDatalist({ id }: { id: string }) {
  const t = useTranslations('Specialties')
  return (
    <datalist id={id}>
      {KEYS.map((k) => <option key={k} value={k} label={t(k)} />)}
    </datalist>
  )
}
